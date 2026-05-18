'use client'

const DB_NAME = 'bkad-blob-store'
const DB_VERSION = 1
const STORE_NAME = 'blobs'

export interface BlobRecord {
  id: string
  file: Blob
  metadata: Record<string, string>
  synced: boolean
  createdAt: number
}

export class BlobStore {
  private db: IDBDatabase | null = null
  private initPromise: Promise<IDBDatabase> | null = null

  /**
   * Initialize the IndexedDB database.
   * Safe to call multiple times — subsequent calls return the same promise.
   */
  async init(): Promise<IDBDatabase> {
    if (this.db) return this.db
    if (this.initPromise) return this.initPromise

    this.initPromise = new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION)

      request.onupgradeneeded = () => {
        const db = request.result
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' })
          store.createIndex('synced', 'synced', { unique: false })
          store.createIndex('createdAt', 'createdAt', { unique: false })
        }
      }

      request.onsuccess = () => {
        this.db = request.result

        // Re-initialize if the connection is unexpectedly closed
        this.db.onclose = () => {
          this.db = null
          this.initPromise = null
        }

        resolve(this.db)
      }

      request.onerror = () => {
        this.initPromise = null
        reject(new Error(`Failed to open IndexedDB: ${request.error?.message}`))
      }
    })

    return this.initPromise
  }

  // ─── CRUD Operations ────────────────────────────────────────────────

  /**
   * Save a file to IndexedDB and return a local blob URL.
   */
  async saveFile(
    file: File,
    metadata?: Record<string, string>,
  ): Promise<{ id: string; url: string }> {
    const db = await this.init()
    const id = crypto.randomUUID()

    const record: BlobRecord = {
      id,
      file: file,
      metadata: metadata ?? {},
      synced: false,
      createdAt: Date.now(),
    }

    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite')
      const store = tx.objectStore(STORE_NAME)
      const req = store.add(record)

      req.onsuccess = () => resolve()
      req.onerror = () => reject(new Error(`Failed to save file: ${req.error?.message}`))
    })

    const url = URL.createObjectURL(file)

    return { id, url }
  }

  /**
   * Retrieve a file record from IndexedDB by id.
   * Returns the full BlobRecord or null if not found.
   */
  async getFile(id: string): Promise<BlobRecord | null> {
    const db = await this.init()

    return new Promise<BlobRecord | null>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly')
      const store = tx.objectStore(STORE_NAME)
      const req = store.get(id)

      req.onsuccess = () => resolve(req.result ?? null)
      req.onerror = () => reject(new Error(`Failed to get file: ${req.error?.message}`))
    })
  }

  /**
   * Delete a file from IndexedDB by id.
   */
  async deleteFile(id: string): Promise<void> {
    const db = await this.init()

    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite')
      const store = tx.objectStore(STORE_NAME)
      const req = store.delete(id)

      req.onsuccess = () => resolve()
      req.onerror = () => reject(new Error(`Failed to delete file: ${req.error?.message}`))
    })
  }

  // ─── Sync Operations ────────────────────────────────────────────────

  /**
   * Upload a local file to the server API.
   * Marks the record as synced on success.
   */
  async syncToServer(id: string): Promise<boolean> {
    const record = await this.getFile(id)
    if (!record) {
      console.warn(`[BlobStore] File ${id} not found, skipping sync.`)
      return false
    }

    if (record.synced) {
      return true
    }

    try {
      const formData = new FormData()

      // Reconstruct a File object from the stored Blob
      const fileName = record.metadata['fileName'] ?? 'unknown'
      const fileType = record.metadata['fileType'] ?? record.file.type ?? 'application/octet-stream'
      const file = new File([record.file], fileName, { type: fileType })
      formData.append('file', file)

      // Attach any extra metadata as headers-like fields
      for (const [key, value] of Object.entries(record.metadata)) {
        formData.append(key, value)
      }

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        console.error(`[BlobStore] Sync failed for ${id}: HTTP ${response.status}`)
        return false
      }

      // Mark as synced
      await this.markSynced(id)
      return true
    } catch (error) {
      console.error(`[BlobStore] Sync error for ${id}:`, error)
      return false
    }
  }

  /**
   * Get all BlobRecords that have not yet been synced to the server.
   */
  async getAllPending(): Promise<BlobRecord[]> {
    const db = await this.init()

    return new Promise<BlobRecord[]>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly')
      const store = tx.objectStore(STORE_NAME)
      const index = store.index('synced')
      const req = index.getAll(IDBKeyRange.only(0))

      // IndexedDB stores booleans as 0/1 in indexes
      // We need to get all where synced === false
      req.onsuccess = () => {
        const results: BlobRecord[] = req.result.filter(
          (r: BlobRecord) => r.synced === false,
        )
        resolve(results)
      }
      req.onerror = () =>
        reject(new Error(`Failed to get pending files: ${req.error?.message}`))
    })
  }

  /**
   * Sync all pending files to the server.
   * Returns the number of successfully synced files.
   */
  async syncAllPending(): Promise<number> {
    const pending = await this.getAllPending()
    let syncedCount = 0

    for (const record of pending) {
      const success = await this.syncToServer(record.id)
      if (success) syncedCount++
    }

    return syncedCount
  }

  // ─── Online Status ──────────────────────────────────────────────────

  /**
   * Check whether the browser is currently online.
   */
  getOnlineStatus(): boolean {
    if (typeof navigator === 'undefined') return true
    return navigator.onLine
  }

  // ─── Private Helpers ────────────────────────────────────────────────

  /**
   * Mark a BlobRecord as synced.
   */
  private async markSynced(id: string): Promise<void> {
    const db = await this.init()

    const record = await this.getFile(id)
    if (!record) return

    record.synced = true

    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite')
      const store = tx.objectStore(STORE_NAME)
      const req = store.put(record)

      req.onsuccess = () => resolve()
      req.onerror = () => reject(new Error(`Failed to mark synced: ${req.error?.message}`))
    })
  }

  /**
   * Get all records in the store (useful for debugging).
   */
  async getAll(): Promise<BlobRecord[]> {
    const db = await this.init()

    return new Promise<BlobRecord[]>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly')
      const store = tx.objectStore(STORE_NAME)
      const req = store.getAll()

      req.onsuccess = () => resolve(req.result)
      req.onerror = () =>
        reject(new Error(`Failed to get all files: ${req.error?.message}`))
    })
  }

  /**
   * Get a blob URL for a stored file (convenience method).
   * Remember to revoke with URL.revokeObjectURL when done.
   */
  async getBlobUrl(id: string): Promise<string | null> {
    const record = await this.getFile(id)
    if (!record) return null
    return URL.createObjectURL(record.file)
  }
}

// ─── Singleton ────────────────────────────────────────────────────────

export const blobStore = new BlobStore()

// ─── Auto-Sync on Online Event ────────────────────────────────────────

if (typeof window !== 'undefined') {
  const handleOnline = () => {
    console.log('[BlobStore] Back online — syncing pending files…')
    blobStore.syncAllPending().then((count) => {
      if (count > 0) {
        console.log(`[BlobStore] Synced ${count} pending file(s).`)
      }
    })
  }

  window.addEventListener('online', handleOnline)

  window.addEventListener('offline', () => {
    console.log('[BlobStore] Gone offline — files will be stored locally.')
  })
}

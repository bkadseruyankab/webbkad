'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Upload, X, ImageOff, Cloud, CloudOff, RefreshCw, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { compressImage, type CompressOptions } from '@/lib/image-compress'
import { blobStore } from '@/lib/blob-store'
import { cn } from '@/lib/utils'

// ─── Types ──────────────────────────────────────────────────────────────

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  thumbnail?: string
  onThumbnailChange?: (url: string) => void
  label?: string
  accept?: string
  compress?: boolean
  maxWidth?: number
  maxHeight?: number
  quality?: number
  maxSizeKB?: number
  useBlobStore?: boolean
  className?: string
}

type UploadStatus = 'idle' | 'compressing' | 'uploading' | 'success' | 'offline' | 'error'

interface SizeInfo {
  original: number
  compressed: number
}

// ─── Helpers ────────────────────────────────────────────────────────────

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`
}

// Helper to resolve uploaded file URLs for display
function resolveFileUrl(url: string): string {
  if (!url) return url;
  if (url.startsWith('/uploads/')) return `/api/files${url}`;
  return url;
}

// ─── Component ──────────────────────────────────────────────────────────

export function ImageUpload({
  value,
  onChange,
  thumbnail,
  onThumbnailChange,
  label = 'Upload Gambar',
  accept = 'image/*',
  compress = true,
  maxWidth,
  maxHeight,
  quality,
  maxSizeKB,
  useBlobStore = true,
  className,
}: ImageUploadProps) {
  // ── State ────────────────────────────────────────────────────────────
  const [status, setStatus] = useState<UploadStatus>('idle')
  const [progress, setProgress] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [sizeInfo, setSizeInfo] = useState<SizeInfo | null>(null)
  const [offlineBlobId, setOfflineBlobId] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isOnline, setIsOnline] = useState(true)
  const [syncing, setSyncing] = useState(false)

  // ── Refs ─────────────────────────────────────────────────────────────
  const fileInputRef = useRef<HTMLInputElement>(null)
  const previewUrlRef = useRef<string | null>(null)

  // ── Online status tracking ───────────────────────────────────────────
  useEffect(() => {
    if (typeof window === 'undefined') return

    setIsOnline(navigator.onLine)

    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // ── Cleanup object URLs on unmount ───────────────────────────────────
  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current)
      }
    }
  }, [])

  // ── Reset status when value changes externally ──────────────────────
  useEffect(() => {
    if (value && status === 'idle') {
      // If there's already a value, clear any leftover size info from a
      // previous upload that was removed.
    }
  }, [value, status])

  // ── Handle file processing ──────────────────────────────────────────
  const processFile = useCallback(
    async (file: File) => {
      // Clean up previous preview URL
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current)
        previewUrlRef.current = null
      }

      try {
        // ── Step 1: Compress ──────────────────────────────────────────
        let processedFile: File
        let originalSize = file.size
        let compressedSize = file.size

        if (compress && file.type.startsWith('image/')) {
          setStatus('compressing')
          const compressOptions: CompressOptions = {}
          if (maxWidth !== undefined) compressOptions.maxWidth = maxWidth
          if (maxHeight !== undefined) compressOptions.maxHeight = maxHeight
          if (quality !== undefined) compressOptions.quality = quality
          if (maxSizeKB !== undefined) compressOptions.maxSizeKB = maxSizeKB

          const result = await compressImage(file, compressOptions)
          processedFile = result.file
          originalSize = result.originalSize
          compressedSize = result.compressedSize
          setSizeInfo({ original: originalSize, compressed: compressedSize })
        } else {
          setSizeInfo(null)
          processedFile = file
        }

        // ── Step 2: Show preview ──────────────────────────────────────
        const localPreview = URL.createObjectURL(processedFile)
        previewUrlRef.current = localPreview
        setPreviewUrl(localPreview)

        // ── Step 3: Upload to server ──────────────────────────────────
        setStatus('uploading')
        setProgress(0)

        if (!navigator.onLine) {
          // Offline path: save to IndexedDB
          if (useBlobStore) {
            const { id, url } = await blobStore.saveFile(processedFile, {
              fileName: processedFile.name,
              fileType: processedFile.type,
              originalSize: String(originalSize),
              compressedSize: String(compressedSize),
            })
            setOfflineBlobId(id)
            onChange(url)
            setStatus('offline')
            return
          }
          // No blob store — just set the local preview
          onChange(localPreview)
          setStatus('offline')
          return
        }

        // Online path: upload via FormData
        const formData = new FormData()
        formData.append('file', processedFile)

        try {
          // Simulate progress with XMLHttpRequest for real progress tracking
          const result = await uploadWithProgress('/api/upload', formData, (p) => {
            setProgress(p)
          })

          const data = result.data
          onChange(data.path)
          if (onThumbnailChange && data.thumbnailPath) {
            onThumbnailChange(data.thumbnailPath)
          }
          setStatus('success')
          setOfflineBlobId(null)
        } catch (uploadError) {
          console.error('[ImageUpload] Upload failed, falling back to blob store:', uploadError)

          // Fallback to blob store on upload failure
          if (useBlobStore) {
            const { id, url } = await blobStore.saveFile(processedFile, {
              fileName: processedFile.name,
              fileType: processedFile.type,
              originalSize: String(originalSize),
              compressedSize: String(compressedSize),
            })
            setOfflineBlobId(id)
            onChange(url)
          } else {
            onChange(localPreview)
          }
          setStatus('offline')
        }
      } catch (error) {
        console.error('[ImageUpload] Processing error:', error)
        setStatus('error')
      }
    },
    [compress, maxWidth, maxHeight, quality, maxSizeKB, useBlobStore, onChange, onThumbnailChange],
  )

  // ── Upload with progress via XMLHttpRequest ──────────────────────────
  const uploadWithProgress = (
    url: string,
    formData: FormData,
    onProgress: (percent: number) => void,
  ): Promise<{ data: Record<string, string> }> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100)
          onProgress(percent)
        }
      }

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText)
            resolve(response)
          } catch {
            reject(new Error('Invalid response JSON'))
          }
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`))
        }
      }

      xhr.onerror = () => reject(new Error('Network error'))
      xhr.onabort = () => reject(new Error('Upload aborted'))

      xhr.open('POST', url)
      xhr.send(formData)
    })
  }

  // ── Drag handlers ───────────────────────────────────────────────────
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)

      const files = e.dataTransfer.files
      if (files.length > 0) {
        processFile(files[0])
      }
    },
    [processFile],
  )

  // ── Click to open file picker ───────────────────────────────────────
  const handleClick = useCallback(() => {
    if (status === 'compressing' || status === 'uploading') return
    fileInputRef.current?.click()
  }, [status])

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (files && files.length > 0) {
        processFile(files[0])
      }
      // Reset input so the same file can be re-selected
      e.target.value = ''
    },
    [processFile],
  )

  // ── Remove image ────────────────────────────────────────────────────
  const handleRemove = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      onChange('')
      onThumbnailChange?.('')
      setStatus('idle')
      setProgress(0)
      setSizeInfo(null)
      setOfflineBlobId(null)
      setPreviewUrl(null)
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current)
        previewUrlRef.current = null
      }
    },
    [onChange, onThumbnailChange],
  )

  // ── Retry sync (offline → online) ──────────────────────────────────
  const handleSync = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation()
      if (!offlineBlobId) return

      setSyncing(true)
      try {
        const success = await blobStore.syncToServer(offlineBlobId)
        if (success) {
          // After sync, we need to get the server path
          // Re-upload to get the response with paths
          const record = await blobStore.getFile(offlineBlobId)
          if (record) {
            const formData = new FormData()
            const file = new File([record.file], record.metadata['fileName'] ?? 'file', {
              type: record.metadata['fileType'] ?? record.file.type,
            })
            formData.append('file', file)

            const response = await fetch('/api/upload', { method: 'POST', body: formData })
            if (response.ok) {
              const result = await response.json()
              onChange(result.data.path)
              if (onThumbnailChange && result.data.thumbnailPath) {
                onThumbnailChange(result.data.thumbnailPath)
              }
              await blobStore.deleteFile(offlineBlobId)
              setOfflineBlobId(null)
              setStatus('success')
            }
          }
        }
      } catch (error) {
        console.error('[ImageUpload] Sync failed:', error)
      } finally {
        setSyncing(false)
      }
    },
    [offlineBlobId, onChange, onThumbnailChange],
  )

  // ── Determine the image to display ──────────────────────────────────
  const displayUrl = previewUrl || resolveFileUrl(value)
  const hasImage = Boolean(displayUrl)
  const isProcessing = status === 'compressing' || status === 'uploading'

  // ── Render ──────────────────────────────────────────────────────────
  return (
    <div className={cn('space-y-2', className)}>
      {/* Label */}
      {label && (
        <label className="text-sm font-medium text-foreground">{label}</label>
      )}

      {/* Drop Zone / Preview */}
      <div
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            handleClick()
          }
        }}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={cn(
          'relative rounded-xl border-2 border-dashed transition-all duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D6B3F]/50 focus-visible:ring-offset-2',
          isDragging
            ? 'border-[#0D6B3F] bg-[#0D6B3F]/5 scale-[1.01]'
            : hasImage
              ? 'border-[#0D6B3F]/30 bg-background'
              : 'border-muted-foreground/25 bg-muted/30 hover:border-[#0D6B3F]/50 hover:bg-muted/50',
          isProcessing && 'pointer-events-none',
        )}
      >
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
          aria-label={label}
        />

        {/* Content */}
        {hasImage ? (
          /* ── Preview Mode ────────────────────────────────────────── */
          <div className="relative p-2">
            {/* Image container */}
            <div className="relative overflow-hidden rounded-lg bg-muted">
              <img
                src={displayUrl}
                alt="Preview"
                className="h-48 w-full object-contain sm:h-56"
              />

              {/* Processing overlay */}
              {isProcessing && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
                  {status === 'compressing' && (
                    <>
                      <RefreshCw className="mb-2 h-6 w-6 animate-spin text-[#0D6B3F]" />
                      <span className="text-sm font-medium text-[#0D6B3F]">
                        Mengompres...
                      </span>
                    </>
                  )}
                  {status === 'uploading' && (
                    <>
                      <Cloud className="mb-2 h-6 w-6 text-[#0D6B3F]" />
                      <span className="text-sm font-medium text-[#0D6B3F]">
                        Mengunggah... {progress}%
                      </span>
                      <div className="mt-2 h-1.5 w-32 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-[#0D6B3F] transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Remove button */}
            {!isProcessing && (
              <Button
                variant="destructive"
                size="icon"
                className="absolute right-4 top-4 z-10 h-7 w-7 rounded-full shadow-md"
                onClick={handleRemove}
                aria-label="Hapus gambar"
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            )}

            {/* Thumbnail indicator */}
            {thumbnail && !isProcessing && (
              <div className="absolute bottom-4 left-4">
                <Badge variant="secondary" className="text-[10px]">
                  <ImageOff className="mr-1 h-3 w-3" />
                  Thumbnail
                </Badge>
              </div>
            )}
          </div>
        ) : (
          /* ── Empty Drop Zone ─────────────────────────────────────── */
          <div className="flex flex-col items-center justify-center py-10 px-4">
            <div
              className={cn(
                'mb-3 flex h-12 w-12 items-center justify-center rounded-full transition-colors',
                isDragging
                  ? 'bg-[#0D6B3F]/10 text-[#0D6B3F]'
                  : 'bg-muted text-muted-foreground',
              )}
            >
              <Upload className="h-6 w-6" />
            </div>
            <p className="text-sm font-medium text-foreground">
              Seret &amp; Lepas atau Klik
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Format: JPG, PNG, WebP
            </p>
          </div>
        )}
      </div>

      {/* ── Status Bar ──────────────────────────────────────────────── */}
      {(sizeInfo || status === 'offline' || status === 'success' || status === 'error') && (
        <div className="flex flex-wrap items-center gap-2">
          {/* Size comparison */}
          {sizeInfo && (
            <span className="text-xs text-muted-foreground">
              Asli: {formatSize(sizeInfo.original)} → Kompresi:{' '}
              {formatSize(sizeInfo.compressed)}
            </span>
          )}

          {/* Success badge */}
          {status === 'success' && (
            <Badge className="border-[#0D6B3F]/20 bg-[#0D6B3F]/10 text-[#0D6B3F]">
              <Check className="h-3 w-3" />
              Berhasil
            </Badge>
          )}

          {/* Offline badge */}
          {status === 'offline' && (
            <Badge variant="outline" className="border-amber-500/30 bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400">
              <CloudOff className="h-3 w-3" />
              Tersimpan Offline
            </Badge>
          )}

          {/* Error badge */}
          {status === 'error' && (
            <Badge variant="destructive">
              Gagal Mengunggah
            </Badge>
          )}

          {/* Sync retry button */}
          {status === 'offline' && offlineBlobId && (
            <Button
              variant="outline"
              size="sm"
              className="h-7 gap-1 text-xs border-[#0D6B3F]/30 text-[#0D6B3F] hover:bg-[#0D6B3F]/5"
              onClick={handleSync}
              disabled={syncing || !isOnline}
            >
              <RefreshCw className={cn('h-3 w-3', syncing && 'animate-spin')} />
              {syncing ? 'Menyinkronkan...' : 'Sinkronkan'}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

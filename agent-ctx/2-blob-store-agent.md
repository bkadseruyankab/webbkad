# Task 2 — Blob Store Agent

## Task
Create a Blob Store utility for the Next.js BKAD project supporting both online and offline modes.

## Files Created

### 1. `/home/z/my-project/src/lib/blob-store.ts`
- **BlobStore class** with IndexedDB backend (DB: `bkad-blob-store`, store: `blobs`)
- **BlobRecord schema**: `id` (UUID), `file` (Blob), `metadata` (Record<string,string>), `synced` (boolean), `createdAt` (number)
- **Core methods**: `init()`, `saveFile()`, `getFile()`, `deleteFile()`, `syncToServer()`, `getAllPending()`, `syncAllPending()`, `getOnlineStatus()`
- **Extra helpers**: `getAll()`, `getBlobUrl()`, `markSynced()` (private)
- **Singleton**: `export const blobStore = new BlobStore()`
- **Auto-sync**: Listens to `online`/`offline` window events; auto-syncs all pending files when browser comes back online
- **Resilient**: Re-initializes DB if connection drops; `init()` is idempotent with promise caching

### 2. `/home/z/my-project/src/lib/image-compress.ts`
- **`compressImage(file, options?)`** using Canvas API
- Default options: maxWidth 1920, maxHeight 1080, quality 0.8, maxSizeKB 500
- Only compresses JPEG/PNG/WebP; other formats returned as-is with dimension info
- Progressive quality reduction (step -0.1) when output exceeds maxSizeKB
- Falls back to 50% dimension reduction if quality alone isn't enough
- PNG → JPEG conversion for better compression ratios
- EXIF orientation preserved via `image-orientation: from-image`
- Returns `CompressResult`: `{ file, originalSize, compressedSize, width, height }`

## Lint
- `bun run lint` passed with zero errors

## Worklog
- Appended work record to `/home/z/my-project/worklog.md`

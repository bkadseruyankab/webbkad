# Task 5a — ImageUpload Component

## Agent: image-upload-agent

## Task
Create a reusable ImageUpload component at `/src/components/bkad/ImageUpload.tsx` with compression and blob store support.

## Work Completed

### File Created
- `/src/components/bkad/ImageUpload.tsx` — "use client" component

### Dependencies Used
- `@/lib/image-compress` — `compressImage()` for client-side image compression
- `@/lib/blob-store` — `blobStore` singleton for IndexedDB offline storage
- `@/components/ui/button` — shadcn/ui Button
- `@/components/ui/badge` — shadcn/ui Badge
- `lucide-react` — Upload, X, ImageOff, Cloud, CloudOff, RefreshCw, Check icons

### Component Props
- `value`, `onChange` — controlled image URL
- `thumbnail`, `onThumbnailChange` — optional thumbnail support
- `label`, `accept`, `compress`, `maxWidth`, `maxHeight`, `quality`, `maxSizeKB` — configuration
- `useBlobStore`, `className` — behavior and styling

### Features Implemented
1. Drag & Drop zone with visual feedback
2. Click to upload (hidden file input)
3. Image preview inside drop zone
4. Compression indicator ("Mengompres...")
5. Upload progress via XMLHttpRequest (real % tracking)
6. Offline support via IndexedDB blob store
7. Size comparison display (Asli → Kompresi)
8. Remove button (X on preview)
9. Retry sync button for offline files

### State Machine
`idle` → `compressing` → `uploading` → `success` | `offline` | `error`

### Lint
- Passed with 0 errors, 0 warnings

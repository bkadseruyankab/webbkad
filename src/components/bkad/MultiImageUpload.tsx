'use client'

import { useCallback, useRef, useState } from 'react'
import { Upload, X, ImageOff, GripVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { compressImage, type CompressOptions } from '@/lib/image-compress'
import { cn } from '@/lib/utils'

// ─── Types ──────────────────────────────────────────────────────────────

interface ImageItem {
  url: string
  alt?: string
  caption?: string
}

interface MultiImageUploadProps {
  value: ImageItem[]
  onChange: (images: ImageItem[]) => void
  label?: string
  maxImages?: number
  compress?: boolean
  maxWidth?: number
  maxHeight?: number
  quality?: number
  maxSizeKB?: number
  className?: string
}

type UploadStatus = 'idle' | 'compressing' | 'uploading' | 'error'

// ─── Component ──────────────────────────────────────────────────────────

export function MultiImageUpload({
  value = [],
  onChange,
  label = 'Upload Gambar',
  maxImages = 10,
  compress = true,
  maxWidth,
  maxHeight,
  quality,
  maxSizeKB,
  className,
}: MultiImageUploadProps) {
  const [status, setStatus] = useState<UploadStatus>('idle')
  const [isDragging, setIsDragging] = useState(false)
  const [editingCaption, setEditingCaption] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const processAndUpload = useCallback(
    async (file: File) => {
      try {
        let processedFile: File = file

        // Compress
        if (compress && file.type.startsWith('image/')) {
          setStatus('compressing')
          const compressOptions: CompressOptions = {}
          if (maxWidth !== undefined) compressOptions.maxWidth = maxWidth
          if (maxHeight !== undefined) compressOptions.maxHeight = maxHeight
          if (quality !== undefined) compressOptions.quality = quality
          if (maxSizeKB !== undefined) compressOptions.maxSizeKB = maxSizeKB

          const result = await compressImage(file, compressOptions)
          processedFile = result.file
        }

        // Upload
        setStatus('uploading')
        const formData = new FormData()
        formData.append('file', processedFile)

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          throw new Error(`Upload failed: ${response.status}`)
        }

        const result = await response.json()

        if (result.success && result.data?.path) {
          const newImage: ImageItem = {
            url: result.data.path,
            alt: file.name,
            caption: '',
          }
          onChange([...value, newImage])
        }
      } catch (error) {
        console.error('[MultiImageUpload] Error:', error)
        setStatus('error')
      } finally {
        setStatus('idle')
      }
    },
    [compress, maxWidth, maxHeight, quality, maxSizeKB, value, onChange],
  )

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      const remaining = maxImages - value.length
      const filesToProcess = Array.from(files).slice(0, remaining)

      for (const file of filesToProcess) {
        if (!file.type.startsWith('image/')) continue
        await processAndUpload(file)
      }
    },
    [maxImages, value.length, processAndUpload],
  )

  const handleRemove = useCallback(
    (index: number) => {
      const newImages = [...value]
      newImages.splice(index, 1)
      onChange(newImages)
    },
    [value, onChange],
  )

  const handleCaptionChange = useCallback(
    (index: number, caption: string) => {
      const newImages = [...value]
      newImages[index] = { ...newImages[index], caption }
      onChange(newImages)
    },
    [value, onChange],
  )

  const handleMove = useCallback(
    (from: number, to: number) => {
      if (to < 0 || to >= value.length) return
      const newImages = [...value]
      const [moved] = newImages.splice(from, 1)
      newImages.splice(to, 0, moved)
      onChange(newImages)
    },
    [value, onChange],
  )

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
      if (e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files)
      }
    },
    [handleFiles],
  )

  const canAddMore = value.length < maxImages
  const isProcessing = status === 'compressing' || status === 'uploading'

  return (
    <div className={cn('space-y-3', className)}>
      {label && (
        <label className="text-sm font-medium text-foreground">
          {label}
          <span className="text-muted-foreground font-normal ml-1">
            ({value.length}/{maxImages})
          </span>
        </label>
      )}

      {/* Existing Images Grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {value.map((img, index) => (
            <div
              key={index}
              className="relative group rounded-xl border-2 border-muted overflow-hidden bg-muted/30"
            >
              <div className="aspect-square relative">
                <img
                  src={img.url}
                  alt={img.alt || `Gambar ${index + 1}`}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex gap-1">
                    {index > 0 && (
                      <Button
                        variant="secondary"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => handleMove(index, index - 1)}
                        title="Pindah ke kiri"
                      >
                        ←
                      </Button>
                    )}
                    {index < value.length - 1 && (
                      <Button
                        variant="secondary"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => handleMove(index, index + 1)}
                        title="Pindah ke kanan"
                      >
                        →
                      </Button>
                    )}
                    <Button
                      variant="destructive"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => handleRemove(index)}
                      title="Hapus gambar"
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
                {/* Index badge */}
                <div className="absolute top-1.5 left-1.5 bg-black/60 text-white text-[10px] font-medium px-1.5 py-0.5 rounded-full">
                  {index + 1}
                </div>
              </div>
              {/* Caption input */}
              <div className="p-1.5">
                <input
                  type="text"
                  value={img.caption || ''}
                  onChange={(e) => handleCaptionChange(index, e.target.value)}
                  placeholder="Keterangan gambar..."
                  className="w-full text-xs bg-transparent border-0 outline-none focus:ring-0 p-0 text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Drop Zone / Add Button */}
      {canAddMore && (
        <div
          role="button"
          tabIndex={0}
          onClick={() => !isProcessing && fileInputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              !isProcessing && fileInputRef.current?.click()
            }
          }}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={cn(
            'relative rounded-xl border-2 border-dashed transition-all duration-200 cursor-pointer',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D6B3F]/50',
            isDragging
              ? 'border-[#0D6B3F] bg-[#0D6B3F]/5 scale-[1.01]'
              : 'border-muted-foreground/25 bg-muted/30 hover:border-[#0D6B3F]/50 hover:bg-muted/50',
            isProcessing && 'pointer-events-none opacity-60',
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                handleFiles(e.target.files)
              }
              e.target.value = ''
            }}
            className="hidden"
            aria-label={label}
          />
          <div className="flex flex-col items-center justify-center py-6 px-4">
            {isProcessing ? (
              <>
                <div className="mb-2 h-8 w-8 animate-spin rounded-full border-2 border-[#0D6B3F] border-t-transparent" />
                <span className="text-sm font-medium text-[#0D6B3F]">
                  {status === 'compressing' ? 'Mengompres...' : 'Mengunggah...'}
                </span>
              </>
            ) : (
              <>
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                  <Upload className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-foreground">
                  Seret & Lepas atau Klik
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Bisa pilih lebih dari 1 gambar ({maxImages - value.length} tersisa)
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Error state */}
      {status === 'error' && (
        <p className="text-xs text-destructive">Gagal mengunggah. Coba lagi.</p>
      )}
    </div>
  )
}

// Helper: Parse images from JSON string or return empty array
export function parseImages(jsonStr: string | undefined | null): ImageItem[] {
  if (!jsonStr) return []
  try {
    const parsed = JSON.parse(jsonStr)
    if (Array.isArray(parsed)) return parsed
    return []
  } catch {
    return []
  }
}

// Helper: Serialize images array to JSON string
export function serializeImages(images: ImageItem[]): string {
  return JSON.stringify(images)
}

export type { ImageItem }

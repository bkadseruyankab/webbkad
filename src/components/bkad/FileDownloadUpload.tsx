'use client'

import { useCallback, useRef, useState } from 'react'
import { Upload, X, FileText, Download, Pencil, Check, File } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn, resolveFileUrl, getDownloadUrl } from '@/lib/utils'

// ─── Types ──────────────────────────────────────────────────────────────

export interface DownloadableFile {
  url: string
  name: string
  originalName: string
  mimeType: string
  size: number
}

interface FileDownloadUploadProps {
  value: DownloadableFile[]
  onChange: (files: DownloadableFile[]) => void
  label?: string
  maxFiles?: number
  accept?: string
  className?: string
}

type UploadStatus = 'idle' | 'uploading' | 'error'

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`
}

function getFileIcon(mimeType: string): string {
  if (mimeType.includes('pdf')) return '📄'
  if (mimeType.includes('word') || mimeType.includes('document')) return '📝'
  if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return '📊'
  if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return '📽️'
  if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('7z')) return '🗜️'
  if (mimeType.includes('image')) return '🖼️'
  return '📎'
}

// ─── Component ──────────────────────────────────────────────────────────

export function FileDownloadUpload({
  value = [],
  onChange,
  label = 'File Unduhan',
  maxFiles = 10,
  accept = '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.rar,.jpg,.jpeg,.png',
  className,
}: FileDownloadUploadProps) {
  const [status, setStatus] = useState<UploadStatus>('idle')
  const [isDragging, setIsDragging] = useState(false)
  const [editingName, setEditingName] = useState<number | null>(null)
  const [tempName, setTempName] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const processAndUpload = useCallback(
    async (file: File) => {
      try {
        setStatus('uploading')
        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          throw new Error(`Upload failed: ${response.status}`)
        }

        const result = await response.json()

        if (result.success && result.data?.path) {
          const newFile: DownloadableFile = {
            url: result.data.path,
            name: file.name.replace(/\.[^.]+$/, ''), // Remove extension for display name
            originalName: file.name,
            mimeType: file.type || 'application/octet-stream',
            size: file.size,
          }
          onChange([...value, newFile])
        }
      } catch (error) {
        console.error('[FileDownloadUpload] Error:', error)
        setStatus('error')
      } finally {
        setStatus('idle')
      }
    },
    [value, onChange],
  )

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      const remaining = maxFiles - value.length
      const filesToProcess = Array.from(files).slice(0, remaining)

      for (const file of filesToProcess) {
        await processAndUpload(file)
      }
    },
    [maxFiles, value.length, processAndUpload],
  )

  const handleRemove = useCallback(
    (index: number) => {
      const newFiles = [...value]
      newFiles.splice(index, 1)
      onChange(newFiles)
    },
    [value, onChange],
  )

  const handleRename = useCallback(
    (index: number, name: string) => {
      const newFiles = [...value]
      newFiles[index] = { ...newFiles[index], name }
      onChange(newFiles)
      setEditingName(null)
    },
    [value, onChange],
  )

  const startEditing = useCallback((index: number) => {
    setEditingName(index)
    setTempName(value[index]?.name || '')
  }, [value])

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

  const canAddMore = value.length < maxFiles
  const isProcessing = status === 'uploading'

  return (
    <div className={cn('space-y-3', className)}>
      {label && (
        <label className="text-sm font-medium text-foreground">
          {label}
          <span className="text-muted-foreground font-normal ml-1">
            ({value.length}/{maxFiles} file)
          </span>
        </label>
      )}

      {/* Existing Files List */}
      {value.length > 0 && (
        <div className="space-y-2">
          {value.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 rounded-xl border border-muted bg-muted/20 hover:bg-muted/40 transition-colors group"
            >
              {/* File Icon */}
              <div className="text-xl flex-shrink-0" title={file.mimeType}>
                {getFileIcon(file.mimeType)}
              </div>

              {/* File Info */}
              <div className="flex-1 min-w-0">
                {editingName === index ? (
                  <div className="flex items-center gap-2">
                    <Input
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      className="h-7 text-sm"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleRename(index, tempName)
                        if (e.key === 'Escape') setEditingName(null)
                      }}
                      autoFocus
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 flex-shrink-0"
                      onClick={() => handleRename(index, tempName)}
                    >
                      <Check className="h-3.5 w-3.5 text-green-600" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 flex-shrink-0"
                      onClick={() => setEditingName(null)}
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground truncate">
                      {file.name}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => startEditing(index)}
                      title="Ubah nama"
                    >
                      <Pencil className="h-3 w-3 text-muted-foreground" />
                    </Button>
                  </div>
                )}
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[11px] text-muted-foreground">
                    {file.originalName}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    • {formatFileSize(file.size)}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 flex-shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 gap-1 text-xs border-[#0D6B3F]/30 text-[#0D6B3F] hover:bg-[#0D6B3F]/5"
                  onClick={() => window.open(getDownloadUrl(file.url), '_blank')}
                  title="Unduh file"
                >
                  <Download className="h-3 w-3" />
                  Unduh
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-destructive"
                  onClick={() => handleRemove(index)}
                  title="Hapus file"
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
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
            accept={accept}
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
                  Mengunggah...
                </span>
              </>
            ) : (
              <>
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                  <File className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-foreground">
                  Seret & Lepas atau Klik
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  PDF, DOC, XLS, PPT, ZIP, Gambar ({maxFiles - value.length} tersisa)
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

// Helper: Parse downloadable files from JSON string or return empty array
export function parseDownloadableFiles(jsonStr: string | undefined | null): DownloadableFile[] {
  if (!jsonStr) return []
  try {
    const parsed = JSON.parse(jsonStr)
    if (Array.isArray(parsed)) return parsed
    return []
  } catch {
    return []
  }
}

// Helper: Serialize downloadable files array to JSON string
export function serializeDownloadableFiles(files: DownloadableFile[]): string {
  return JSON.stringify(files)
}

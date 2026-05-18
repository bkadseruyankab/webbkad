'use client'

export interface CompressOptions {
  /** Maximum width in pixels. Default: 1920 */
  maxWidth?: number
  /** Maximum height in pixels. Default: 1080 */
  maxHeight?: number
  /** JPEG/WebP quality 0–1. Default: 0.8 */
  quality?: number
  /** Maximum output size in KB. If compressed size exceeds this, quality is reduced progressively. Default: 500 */
  maxSizeKB?: number
}

export interface CompressResult {
  file: File
  originalSize: number
  compressedSize: number
  width: number
  height: number
}

const COMPRESSIBLE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
])

const DEFAULT_OPTIONS: Required<CompressOptions> = {
  maxWidth: 1920,
  maxHeight: 1080,
  quality: 0.8,
  maxSizeKB: 500,
}

/**
 * Compress an image file using the Canvas API.
 *
 * - Only JPEG, PNG, and WebP files are compressed; all other formats are returned as-is.
 * - If the image is larger than maxWidth × maxHeight it is proportionally scaled down.
 * - If the compressed output still exceeds `maxSizeKB`, quality is progressively reduced
 *   until the size fits or quality drops below 0.1.
 * - EXIF orientation is preserved via `image-orientation: from-image` on the canvas
 *   (supported in all modern browsers).
 */
export async function compressImage(
  file: File,
  options?: CompressOptions,
): Promise<CompressResult> {
  const opts: Required<CompressOptions> = { ...DEFAULT_OPTIONS, ...options }
  const originalSize = file.size

  // Skip non-compressible formats — return the original file unchanged
  if (!COMPRESSIBLE_TYPES.has(file.type)) {
    const { width, height } = await getImageDimensions(file)
    return {
      file,
      originalSize,
      compressedSize: originalSize,
      width,
      height,
    }
  }

  // Load the image
  const img = await loadImage(file)

  // Calculate scaled dimensions while preserving aspect ratio
  let { width, height } = fitDimensions(
    img.naturalWidth,
    img.naturalHeight,
    opts.maxWidth,
    opts.maxHeight,
  )

  // Draw to canvas at the (possibly reduced) dimensions
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  const ctx = canvas.getContext('2d')
  if (!ctx) {
    // Fallback: can't get context, return original
    return {
      file,
      originalSize,
      compressedSize: originalSize,
      width: img.naturalWidth,
      height: img.naturalHeight,
    }
  }

  // Preserve EXIF orientation — modern browsers handle this natively
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(img, 0, 0, width, height)

  // Determine output format — prefer the original type; fall back to JPEG for PNG
  // (PNG → JPEG is usually much smaller)
  let outputType = file.type
  if (file.type === 'image/png') {
    outputType = 'image/jpeg' // PNGs compress poorly; JPEG is more efficient
  }

  // Progressive quality reduction to meet maxSizeKB
  let quality = opts.quality
  let blob = await canvasToBlob(canvas, outputType, quality)

  const maxBytes = opts.maxSizeKB * 1024
  while (blob.size > maxBytes && quality > 0.1) {
    quality = Math.max(0.1, quality - 0.1)
    blob = await canvasToBlob(canvas, outputType, quality)
  }

  // If still over limit after minimum quality, try reducing dimensions by 50%
  if (blob.size > maxBytes) {
    const halfWidth = Math.round(width / 2)
    const halfHeight = Math.round(height / 2)
    canvas.width = halfWidth
    canvas.height = halfHeight
    ctx.drawImage(img, 0, 0, halfWidth, halfHeight)
    quality = opts.quality
    blob = await canvasToBlob(canvas, outputType, quality)

    while (blob.size > maxBytes && quality > 0.1) {
      quality = Math.max(0.1, quality - 0.1)
      blob = await canvasToBlob(canvas, outputType, quality)
    }

    width = halfWidth
    height = halfHeight
  }

  // Build a new File from the compressed blob
  const extension = extensionForType(outputType)
  const baseName = file.name.replace(/\.[^.]+$/, '')
  const compressedFile = new File([blob], `${baseName}.${extension}`, {
    type: outputType,
    lastModified: Date.now(),
  })

  return {
    file: compressedFile,
    originalSize,
    compressedSize: blob.size,
    width,
    height,
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────

/**
 * Load a File as an HTMLImageElement.
 */
function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()

    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error(`Failed to load image: ${file.name}`))
    }

    // Ensure EXIF orientation is honoured
    img.style.imageOrientation = 'from-image'
    img.src = url
  })
}

/**
 * Get the natural dimensions of an image file without full decoding.
 */
function getImageDimensions(
  file: File,
): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file)
    const img = new Image()

    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve({ width: img.naturalWidth, height: img.naturalHeight })
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      resolve({ width: 0, height: 0 })
    }

    img.src = url
  })
}

/**
 * Scale dimensions to fit within maxWidth × maxHeight while preserving
 * aspect ratio. Returns original dimensions if already within bounds.
 */
function fitDimensions(
  w: number,
  h: number,
  maxWidth: number,
  maxHeight: number,
): { width: number; height: number } {
  if (w <= maxWidth && h <= maxHeight) {
    return { width: w, height: h }
  }

  const ratioW = maxWidth / w
  const ratioH = maxHeight / h
  const scale = Math.min(ratioW, ratioH)

  return {
    width: Math.round(w * scale),
    height: Math.round(h * scale),
  }
}

/**
 * Convert a canvas to a Blob promise.
 */
function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob)
        } else {
          reject(new Error('Canvas toBlob returned null'))
        }
      },
      type,
      quality,
    )
  })
}

/**
 * Get a file extension for a MIME type.
 */
function extensionForType(type: string): string {
  switch (type) {
    case 'image/jpeg':
      return 'jpg'
    case 'image/png':
      return 'png'
    case 'image/webp':
      return 'webp'
    default:
      return 'bin'
  }
}

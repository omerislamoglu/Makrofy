/**
 * imageCompression — AI analizine gönderilmeden önce görüntüyü sıkıştırır.
 *
 * - Max 1024×1024 px (AI tanıma için yeterli, daha hızlı yükleme + analiz)
 * - JPEG quality 0.80
 * - Base64 yalnızca sıkıştırma SONRASI üretilir
 * - Orijinal base64 hiçbir zaman state'te tutulmaz
 */

// 1024px is plenty for food recognition and keeps the upload + the model's
// image-prefill small, which is the cheapest latency win. (Was 1536px.)
const MAX_DIMENSION = 1024
const JPEG_QUALITY = 0.80
const MAX_SIZE_BYTES = 1.5 * 1024 * 1024 // 1.5 MB

export interface CompressedImage {
  blob: Blob
  dataUrl: string
  width: number
  height: number
  sizeBytes: number
}

/**
 * Blob, objectURL veya data URL'den AI için optimize edilmiş JPEG üretir.
 */
export async function compressImageForAI(input: Blob | string): Promise<CompressedImage> {
  const blob =
    typeof input === 'string'
      ? await (await fetch(input)).blob()
      : input

  const img = await loadImageFromBlob(blob)

  let { width, height } = img
  if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
    const ratio = Math.min(MAX_DIMENSION / width, MAX_DIMENSION / height)
    width = Math.round(width * ratio)
    height = Math.round(height * ratio)
  }

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas 2D context not available')
  ctx.drawImage(img, 0, 0, width, height)

  let quality = JPEG_QUALITY
  let resultBlob = await canvasToJpegBlob(canvas, quality)

  // Hâlâ büyükse quality'yi düşür
  if (resultBlob.size > MAX_SIZE_BYTES) {
    quality = 0.5
    resultBlob = await canvasToJpegBlob(canvas, quality)
  }

  const dataUrl = await blobToDataUrl(resultBlob)

  return {
    blob: resultBlob,
    dataUrl,
    width,
    height,
    sizeBytes: resultBlob.size,
  }
}

// ── Yardımcılar ─────────────────────────────────────────────────────────────

function loadImageFromBlob(blob: Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Image load failed'))
    }
    img.src = url
  })
}

function canvasToJpegBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('canvas.toBlob failed'))),
      'image/jpeg',
      quality
    )
  })
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target?.result as string)
    reader.onerror = () => reject(new Error('FileReader failed'))
    reader.readAsDataURL(blob)
  })
}

import { useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Camera,
  Upload,
  Image as ImageIcon,
  X,
  Sparkles,
  AlertCircle,
  Zap,
  ChevronRight,
} from 'lucide-react'
import type { ScanLimit } from '../types/subscription'
import { useAuth } from '../hooks/useAuth'
import { useScanLimit } from '../hooks/useScanLimit'
import { analyzeMealImage, ScanServiceError } from '../services/scanService'
import { useLocale } from '../contexts/LocaleContext'
import Button from '../components/ui/Button'

// ─── Constants ─────────────────────────────────────────────────────────────

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10 MB
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic']

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target?.result as string)
    reader.onerror = () => reject(new Error('read-error'))
    reader.readAsDataURL(file)
  })
}

// ─── Sub-components ────────────────────────────────────────────────────────

function UploadZone({
  onFileSelect,
  isDragging,
  onDragEnter,
  onDragLeave,
  onDrop,
}: {
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void
  isDragging: boolean
  onDragEnter: (e: React.DragEvent) => void
  onDragLeave: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent) => void
}) {
  const cameraRef = useRef<HTMLInputElement>(null)
  const galleryRef = useRef<HTMLInputElement>(null)
  const { strings } = useLocale()
  const ap = strings.addPage

  return (
    <>
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={onFileSelect}
        className="hidden"
        id="scan-camera-input"
      />
      <input
        ref={galleryRef}
        type="file"
        accept="image/*"
        onChange={onFileSelect}
        className="hidden"
        id="scan-gallery-input"
      />

      {/* Primary: Take Photo button */}
      <motion.button
        id="take-photo-button"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        onClick={() => cameraRef.current?.click()}
        className="w-full bg-white text-black rounded-3xl p-5 flex items-center gap-4 hover:bg-zinc-100 active:scale-[0.98] transition-all duration-150 mb-3"
      >
        <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center flex-shrink-0">
          <Camera size={24} className="text-white" />
        </div>
        <div className="text-left flex-1">
          <p className="text-[16px] font-bold">{ap.takePhoto}</p>
          <p className="text-[12px] text-zinc-500">{ap.takePhotoSub}</p>
        </div>
        <div className="flex-shrink-0">
          <Sparkles size={18} className="text-zinc-400" />
        </div>
      </motion.button>

      {/* Secondary: Gallery upload */}
      <motion.button
        id="upload-gallery-button"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.2 }}
        onClick={() => galleryRef.current?.click()}
        className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-2xl p-4 flex items-center gap-3.5 hover:bg-zinc-800 active:scale-[0.98] transition-all duration-150 mb-4"
      >
        <div className="w-11 h-11 bg-zinc-800 rounded-xl flex items-center justify-center flex-shrink-0">
          <Upload size={18} className="text-zinc-300" />
        </div>
        <div className="text-left flex-1">
          <p className="text-[14px] font-semibold">{ap.uploadGallery}</p>
          <p className="text-[11px] text-zinc-500">{ap.uploadGallerySub}</p>
        </div>
      </motion.button>

      {/* Drop zone for desktop */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        onDragOver={(e) => e.preventDefault()}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => galleryRef.current?.click()}
        className={`
          cursor-pointer rounded-2xl border-2 border-dashed
          transition-all duration-300 ease-out
          flex items-center justify-center gap-3
          py-6 px-4
          ${
            isDragging
              ? 'border-white/60 bg-white/5 scale-[1.01]'
              : 'border-zinc-800/50 bg-zinc-900/30 hover:border-zinc-600/50'
          }
        `}
      >
        <ImageIcon size={18} className="text-zinc-600" />
        <p className="text-[12px] text-zinc-500">
          {isDragging ? ap.dropHere : ap.dragHere}
        </p>
        <span className="text-[10px] text-zinc-600 bg-zinc-800/50 rounded-md px-2 py-0.5">
          JPG, PNG, WebP
        </span>
      </motion.div>
    </>
  )
}

function ImagePreview({
  src,
  onRemove,
  onAnalyze,
  analyzing,
}: {
  src: string
  onRemove: () => void
  onAnalyze: () => void
  analyzing: boolean
}) {
  const { strings } = useLocale()
  const ap = strings.addPage

  return (
    <motion.div
      key="preview"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.35 }}
    >
      <div className="relative rounded-3xl overflow-hidden border border-zinc-800/50 mb-5">
        <img
          src={src}
          alt="Meal preview"
          className={`w-full aspect-[4/3] object-cover transition-all duration-500 ${
            analyzing ? 'brightness-50 blur-[2px] scale-[1.02]' : ''
          }`}
        />

        {!analyzing && (
          <button type="button"
            id="remove-image-button"
            onClick={onRemove}
            className="absolute top-3 right-3 w-9 h-9 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-black/80 active:scale-95 transition-all"
          >
            <X size={16} className="text-white" />
          </button>
        )}

        {analyzing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="mb-4"
            >
              <div className="w-12 h-12 rounded-full border-2 border-white/20 border-t-white flex items-center justify-center">
                <Sparkles size={18} className="text-white" />
              </div>
            </motion.div>
            <p className="text-[15px] font-semibold text-white mb-1">
              {ap.analyzingMeal}
            </p>
            <p className="text-[12px] text-zinc-400">
              {ap.analyzingWait}
            </p>
            <div className="flex gap-1.5 mt-4">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                  className="w-1.5 h-1.5 rounded-full bg-white"
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {!analyzing && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
        >
          <Button
            id="analyze-meal-button"
            variant="primary"
            size="lg"
            fullWidth
            onClick={onAnalyze}
            icon={<Sparkles size={18} />}
          >
            {ap.analyzeMeal}
          </Button>
        </motion.div>
      )}
    </motion.div>
  )
}

function ScanLimitBar({
  limit,
  isPro,
  onUpgrade,
}: {
  limit: ScanLimit
  isPro: boolean
  onUpgrade: () => void
}) {
  const { strings } = useLocale()
  const ap = strings.addPage

  // Unlimited remaining means pro (shouldn't reach here, but guard)
  if (limit.remaining === Infinity) return null

  // Scans exhausted — show upgrade prompt
  if (limit.isLimited) {
    if (isPro) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="w-full bg-zinc-900 rounded-2xl px-4 py-4 border border-zinc-800/50 flex items-center gap-3"
        >
          <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
            <Zap size={16} className="text-white" />
          </div>
          <div className="text-left">
            <p className="text-[13px] font-medium text-zinc-200">{ap.dailyQuotaExhausted}</p>
            <p className="text-[11px] text-zinc-500">{ap.scanAvailableAll}</p>
          </div>
        </motion.div>
      )
    }

    return (
      <motion.button
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        onClick={onUpgrade}
        className="w-full bg-zinc-900 rounded-2xl px-4 py-4 border border-zinc-800/50 flex items-center justify-between hover:bg-zinc-800/80 active:scale-[0.99] transition-all duration-200"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
            <Zap size={16} className="text-white" />
          </div>
          <div className="text-left">
            <p className="text-[13px] font-medium text-zinc-200">
              {ap.scanOpenAll}
            </p>
            <p className="text-[11px] text-zinc-500">
              {ap.scanAvailableAll}
            </p>
          </div>
        </div>
        <ChevronRight size={16} className="text-zinc-600" />
      </motion.button>
    )
  }

  // Scans remaining — show count
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.3 }}
      className="bg-zinc-900/70 rounded-xl px-4 py-3 border border-zinc-800/40 flex items-center justify-between"
    >
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
          <Zap size={13} className="text-white" />
        </div>
        <span className="text-[13px] text-zinc-300">
          <span className="font-bold tabular-nums">{limit.remaining}</span>{' '}
          {strings.scanBanner.remaining(limit.remaining)}
        </span>
      </div>
      <Sparkles size={14} className="text-zinc-600" />
    </motion.div>
  )
}

// ─── Main component ────────────────────────────────────────────────────────

export default function ScanPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { limit, isPro, canScan, showPaywall, consumeScan } = useScanLimit(user?.uid, user?.isPro)
  const { strings, locale } = useLocale()
  const ap = strings.addPage

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  // ── Gate: check scan availability, redirect to paywall if blocked ──────
  const guardScan = useCallback((): boolean => {
    if (canScan) return true
    if (isPro) {
      setError(ap.quotaExhaustedSub)
    } else {
      navigate('/paywall')
    }
    return false
  }, [ap.quotaExhaustedSub, canScan, isPro, navigate])

  // ── File selection ─────────────────────────────────────────────────────
  const processFile = useCallback(
    async (file: File) => {
      setError(null)

      // Validate file type and size
      if (!ACCEPTED_TYPES.includes(file.type) && !file.name.toLowerCase().endsWith('.heic')) {
        setError(ap.unsupportedFormat)
        return
      }
      if (file.size > MAX_FILE_SIZE) {
        setError(ap.imageTooLarge)
        return
      }

      // Check limit before letting user proceed
      if (!guardScan()) return

      try {
        const dataUrl = await fileToDataUrl(file)
        setSelectedFile(file)
        setImagePreview(dataUrl)
      } catch {
        setError(ap.uploadFailed)
      }
    },
    [guardScan, ap]
  )

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return
      processFile(file)
      e.target.value = ''
    },
    [processFile]
  )

  // ── Drag & Drop ────────────────────────────────────────────────────────
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

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)
      const file = e.dataTransfer.files?.[0]
      if (file) processFile(file)
    },
    [processFile]
  )

  // ── Remove image ───────────────────────────────────────────────────────
  const removeImage = useCallback(() => {
    setSelectedFile(null)
    setImagePreview(null)
    setError(null)
  }, [])

  // ── Analyze ────────────────────────────────────────────────────────────
  const handleAnalyze = useCallback(async () => {
    if (!selectedFile || !imagePreview) return

    // Re-check before the analysis call (limit may have changed)
    if (!guardScan()) return

    setError(null)
    setAnalyzing(true)

    try {
      const result = await analyzeMealImage(selectedFile, { locale })

      // ── SUCCESS: consume scan ONLY after successful analysis ──
      consumeScan()

      navigate('/analysis', {
        state: { result, imagePreview },
      })
    } catch (err) {
      // ── FAILURE: do NOT consume a scan ──
      if (err instanceof ScanServiceError) {
        setError(err.message)
      } else {
        setError(ap.analysisFailed)
      }
      setAnalyzing(false)
    }
  }, [selectedFile, imagePreview, guardScan, consumeScan, navigate, ap])

  if (showPaywall) {
    return (
      <div className="px-5 pt-14 pb-8 max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-8"
          >
            <h1 className="text-[26px] font-bold tracking-tight">
              {strings.add.tabScan}
            </h1>
            <p className="text-zinc-400 text-sm mt-1.5 leading-relaxed">
              AI analizi Pro'ya özel. Ücretsiz hesaplarda AI fotoğraf analizi hakkı yok.
            </p>
          </motion.div>

          <ScanLimitBar
            limit={limit}
            isPro={isPro}
            onUpgrade={() => navigate('/paywall')}
          />
        </motion.div>
      </div>
    )
  }

  return (
    <div className="px-5 pt-14 pb-8 max-w-lg mx-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* ── Header ─────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <h1 className="text-[26px] font-bold tracking-tight">
            {strings.add.tabScan}
          </h1>
          <p className="text-zinc-400 text-sm mt-1.5 leading-relaxed">
            {ap.scanDisclaimer}
          </p>
        </motion.div>

        {/* ── Scan limit banner ───────────────────────────────────── */}
        <div className="mb-5">
          <ScanLimitBar
            limit={limit}
            isPro={isPro}
            onUpgrade={() => navigate('/paywall')}
          />
        </div>

        {/* ── Error banner ────────────────────────────────────────── */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-5 overflow-hidden"
            >
              <div className="bg-zinc-900 border border-red-500/20 rounded-xl px-4 py-3 flex items-start gap-3">
                <AlertCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] text-zinc-200">{error}</p>
                </div>
                <button type="button"
                  onClick={() => setError(null)}
                  className="p-1 rounded-lg hover:bg-zinc-800 transition-colors flex-shrink-0"
                >
                  <X size={14} className="text-zinc-500" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Main content: upload vs preview ──────────────────────── */}
        <AnimatePresence mode="wait">
          {imagePreview ? (
            <ImagePreview
              key="preview"
              src={imagePreview}
              onRemove={removeImage}
              onAnalyze={handleAnalyze}
              analyzing={analyzing}
            />
          ) : (
            <motion.div
              key="upload"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
            >
              <UploadZone
                onFileSelect={handleFileSelect}
                isDragging={isDragging}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Tip ──────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="mt-8 bg-zinc-900/50 rounded-xl px-4 py-3 border border-zinc-800/30"
        >
          <p className="text-[11px] text-zinc-500 text-center leading-relaxed">
            {ap.scanTip}
          </p>
        </motion.div>

        {/* ── Disclaimer ──────────────────────────────────────────── */}
        <p className="text-center text-[10px] text-zinc-600 mt-5">
          {ap.scanDisclaimer}
        </p>
      </motion.div>
    </div>
  )
}

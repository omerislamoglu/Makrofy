import { useEffect, useCallback, ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

const MotionCloseButton = motion.create('button')

export interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  description?: string
  children: ReactNode
  showClose?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const sizeStyles: Record<string, string> = {
  sm: 'max-w-xs',
  md: 'max-w-sm',
  lg: 'max-w-md',
}

export default function Modal({
  open,
  onClose,
  title,
  description,
  children,
  showClose = true,
  size = 'md',
}: ModalProps) {
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose]
  )

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [open, handleEscape])

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            className={`
              relative w-full ${sizeStyles[size]} mx-4
              bg-zinc-900 border border-zinc-800/60
              rounded-t-3xl sm:rounded-3xl
              p-6 pb-8 sm:pb-6
              shadow-2xl shadow-black/40
            `}
          >
            {/* Drag handle (mobile) */}
            <div className="sm:hidden w-10 h-1 bg-zinc-700 rounded-full mx-auto mb-5" />

            {showClose && (
              <MotionCloseButton
                onClick={onClose}
                whileTap={{ scale: 0.85, rotate: 90 }}
                whileHover={{ backgroundColor: 'rgba(39,39,42,0.8)' }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                className="absolute top-4 right-4 p-1.5 rounded-full transition-colors"
              >
                <X size={18} className="text-zinc-400" />
              </MotionCloseButton>
            )}

            {title && (
              <h2 className="text-lg font-semibold mb-1 pr-8">{title}</h2>
            )}
            {description && (
              <p className="text-sm text-zinc-400 mb-5">{description}</p>
            )}

            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

import { motion, AnimatePresence } from 'framer-motion'
import { Star, X } from 'lucide-react'
import Button from './Button'
import { useLocale } from '../../contexts/LocaleContext'

interface RatingModalProps {
  show: boolean
  onRate: () => void
  onLater: () => void
  onDismiss: () => void
}

export default function RatingModal({ show, onRate, onLater, onDismiss }: RatingModalProps) {
  const { locale } = useLocale()
  const isEN = locale === 'en'

  if (!show) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-md flex items-center justify-center p-5"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className="w-full max-w-[320px] bg-zinc-900 border border-zinc-800 rounded-3xl p-6 relative shadow-2xl"
        >
          <button
            type="button"
            onClick={onDismiss}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-zinc-800/50 text-zinc-400 hover:text-white transition-colors"
            aria-label={isEN ? 'Close' : 'Kapat'}
          >
            <X size={16} />
          </button>

          <div className="flex flex-col items-center text-center mt-2">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-400/20 to-amber-600/20 border border-amber-500/30 rounded-2xl flex items-center justify-center mb-5">
              <Star className="text-amber-400 fill-amber-400" size={32} />
            </div>
            
            <h3 className="text-[20px] font-bold text-white mb-2">
              {isEN ? 'Enjoying Makrofy?' : "Makrofy'ı Sevdin Mi?"}
            </h3>
            <p className="text-[13px] text-zinc-400 mb-6 leading-relaxed">
              {isEN
                ? 'Would you rate the app in the store? Your feedback helps us improve Makrofy.'
                : 'Bize destek olmak için uygulamayı mağazada değerlendirir misin? Yorumların kendimizi geliştirmemiz için çok değerli.'}
            </p>

            <div className="w-full space-y-3">
              <Button variant="primary" fullWidth onClick={onRate}>
                {isEN ? 'Rate Makrofy' : 'Beş Yıldız Ver'}
              </Button>
              <Button variant="secondary" fullWidth onClick={onLater}>
                {isEN ? 'Later' : 'Daha Sonra'}
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

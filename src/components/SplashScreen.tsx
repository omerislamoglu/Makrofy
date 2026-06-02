import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import MakrofyLogo from './ui/MakrofyLogo'

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(onFinish, 700)
    }, 2400)
    return () => clearTimeout(timer)
  }, [onFinish])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center overflow-hidden"
        >
          <motion.div
            initial={{ scale: 0.86, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 190, damping: 20, delay: 0.08 }}
            className="relative mb-7"
          >
            <MakrofyLogo variant="icon" size={132} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.38, ease: 'easeOut' }}
            className="text-[35px] font-[850] leading-none text-white"
            style={{
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
              letterSpacing: 0,
            }}
          >
            Makrofy
          </motion.div>

          <motion.div
            className="absolute bottom-16 h-[2px] w-10 rounded-full bg-white/80"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.72 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

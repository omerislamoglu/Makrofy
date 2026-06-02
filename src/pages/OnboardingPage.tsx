import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Button from '../components/ui/Button'
import MakrofyLogo from '../components/ui/MakrofyLogo'

const steps = [
  {
    icon: '📸',
    title: 'AI ile Tara',
    description: 'Yemeğinin fotoğrafını çek, anında besin değerlerini öğren.',
  },
  {
    icon: '📊',
    title: 'Makrolarını Bil',
    description: 'Protein, karbonhidrat, yağ ve kaloriyi tek bakışta gör.',
  },
  {
    icon: '🎯',
    title: 'Düzenli Kal',
    description: 'Basit ve yargısız takip ile daha iyi alışkanlıklar edin.',
  },
]

export default function OnboardingPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6 safe-area-top">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm text-center"
      >
        {/* ── Logo ─────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="flex justify-center mb-14"
        >
          <MakrofyLogo size={80} variant="full" />
        </motion.div>

        {/* ── Feature Steps ─────────────────────────────────────── */}
        <div className="space-y-6 mb-12">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.15, duration: 0.4 }}
              className="flex items-start gap-4 text-left bg-zinc-900/60 rounded-2xl px-4 py-4 border border-zinc-800/40"
            >
              <span className="text-2xl flex-shrink-0 mt-0.5">{step.icon}</span>
              <div>
                <h3 className="text-[15px] font-semibold text-zinc-100 mb-0.5">{step.title}</h3>
                <p className="text-[13px] text-zinc-500 leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75 }}
        >
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={() => navigate('/auth')}
          >
            Başla
          </Button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-[11px] text-zinc-700 mt-6"
        >
          Tüm besin değerleri tahminidir.
        </motion.p>
      </motion.div>
    </div>
  )
}


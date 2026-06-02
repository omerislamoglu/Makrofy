import { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'

export interface PageHeaderProps {
  title: string
  subtitle?: string
  showBack?: boolean
  onBack?: () => void
  rightAction?: ReactNode
  size?: 'default' | 'large'
}

export default function PageHeader({
  title,
  subtitle,
  showBack,
  onBack,
  rightAction,
  size = 'default',
}: PageHeaderProps) {
  const navigate = useNavigate()

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      navigate(-1)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-8"
    >
      {showBack && (
        <button
          onClick={handleBack}
          className="mb-4 -ml-1 p-1.5 rounded-xl hover:bg-zinc-800/60 active:bg-zinc-800 transition-colors"
        >
          <ArrowLeft size={20} className="text-zinc-400" />
        </button>
      )}

      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1
            className={`font-bold tracking-tight ${
              size === 'large' ? 'text-3xl' : 'text-2xl'
            }`}
          >
            {title}
          </h1>
          {subtitle && (
            <p className="text-zinc-400 text-sm mt-1.5 leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
        {rightAction && (
          <div className="flex-shrink-0">{rightAction}</div>
        )}
      </div>
    </motion.div>
  )
}

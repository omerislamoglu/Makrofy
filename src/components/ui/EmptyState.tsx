import { ReactNode } from 'react'
import { motion } from 'framer-motion'

export interface EmptyStateProps {
  title: string
  description?: string
  icon?: ReactNode
  action?: ReactNode
}

export default function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-zinc-900/40 rounded-2xl p-10 text-center border border-zinc-800/20"
    >
      {icon && (
        <div className="flex justify-center mb-4 text-zinc-600">{icon}</div>
      )}
      <p className="text-zinc-300 text-sm font-medium">{title}</p>
      {description && (
        <p className="text-zinc-500 text-xs mt-1.5 leading-relaxed">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </motion.div>
  )
}

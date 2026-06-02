import { ReactNode } from 'react'

export interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'pro' | 'outline'
  size?: 'sm' | 'md'
  children: ReactNode
  icon?: ReactNode
}

const variantStyles: Record<string, string> = {
  default: 'bg-zinc-800 text-zinc-300',
  success: 'bg-zinc-800 text-white',
  warning: 'bg-zinc-800 text-zinc-300',
  pro: 'bg-white/10 text-white border border-white/20',
  outline: 'bg-transparent text-zinc-400 border border-zinc-700',
}

const sizeStyles: Record<string, string> = {
  sm: 'h-5 px-2 text-[10px] gap-1',
  md: 'h-6 px-2.5 text-[11px] gap-1.5',
}

export default function Badge({
  variant = 'default',
  size = 'sm',
  children,
  icon,
}: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center rounded-full font-medium uppercase tracking-wider whitespace-nowrap',
        variantStyles[variant],
        sizeStyles[size],
      ].join(' ')}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </span>
  )
}

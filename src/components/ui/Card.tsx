import { HTMLAttributes, forwardRef } from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'subtle' | 'interactive'
  padding?: 'none' | 'xs' | 'sm' | 'md' | 'lg'
  animated?: boolean
  animationDelay?: number
}

const variantStyles: Record<string, string> = {
  default: 'bg-zinc-900 border border-zinc-800/50',
  elevated: 'bg-zinc-900 border border-zinc-800/50 shadow-lg shadow-black/20',
  subtle: 'bg-zinc-900/50 border border-zinc-800/30',
  interactive:
    'bg-zinc-900 border border-zinc-800/50 hover:bg-zinc-800/80 hover:border-zinc-700/50 active:scale-[0.99] cursor-pointer',
}

const paddingStyles: Record<string, string> = {
  none: '',
  xs: 'p-2',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'default',
      padding = 'md',
      animated = true,
      animationDelay = 0,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const baseClasses = [
      'rounded-2xl transition-all duration-200',
      variantStyles[variant],
      paddingStyles[padding],
      className,
    ].join(' ')

    if (animated) {
      return (
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{
            duration: 0.35,
            delay: animationDelay,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          className={baseClasses}
          {...(props as HTMLMotionProps<'div'>)}
        >
          {children}
        </motion.div>
      )
    }

    return (
      <div ref={ref} className={baseClasses} {...props}>
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'
export default Card

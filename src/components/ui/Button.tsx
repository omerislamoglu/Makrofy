import { ButtonHTMLAttributes, ComponentProps, forwardRef } from 'react'
import { motion } from 'framer-motion'
import Spinner from './Spinner'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
  size?: 'xs' | 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  loading?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
}

const variants: Record<string, string> = {
  primary:
    'bg-white text-black hover:bg-zinc-100 active:bg-zinc-200 shadow-[0_0_0_1px_rgba(255,255,255,0.1)]',
  secondary:
    'bg-zinc-900 text-white border border-zinc-800 hover:bg-zinc-800 active:bg-zinc-700',
  ghost:
    'text-zinc-400 hover:text-white hover:bg-zinc-800/60 active:bg-zinc-800',
  danger:
    'text-red-400 hover:bg-red-500/10 active:bg-red-500/20',
  outline:
    'text-white border border-zinc-700 hover:border-zinc-500 hover:bg-zinc-900 active:bg-zinc-800',
}

const sizes: Record<string, string> = {
  xs: 'h-7 px-2.5 text-xs rounded-lg gap-1',
  sm: 'h-9 px-3.5 text-sm rounded-xl gap-1.5',
  md: 'h-11 px-5 text-sm rounded-xl gap-2',
  lg: 'h-[52px] px-6 text-base rounded-2xl gap-2.5 font-semibold',
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      loading = false,
      icon,
      iconPosition = 'left',
      className = '',
      disabled,
      children,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading
    const motionProps = props as unknown as ComponentProps<typeof motion.button>

    return (
      <motion.button
        ref={ref}
        whileTap={isDisabled ? undefined : { scale: 0.985 }}
        transition={{ duration: 0.06, ease: 'easeOut' }}
        className={[
          'inline-flex items-center justify-center font-medium',
          'transition-colors duration-75 ease-out touch-manipulation select-none',
          'disabled:opacity-40 disabled:cursor-not-allowed',
          variants[variant],
          sizes[size],
          fullWidth ? 'w-full' : '',
          className,
        ].join(' ')}
        type={type}
        disabled={isDisabled}
        {...motionProps}
      >
        {loading ? (
          <Spinner size="sm" />
        ) : (
          <>
            {icon && iconPosition === 'left' && (
              <span className="flex-shrink-0">
                {icon}
              </span>
            )}
            {children && <span>{children}</span>}
            {icon && iconPosition === 'right' && (
              <span className="flex-shrink-0">
                {icon}
              </span>
            )}
          </>
        )}
      </motion.button>
    )
  }
)

Button.displayName = 'Button'
export default Button

import { InputHTMLAttributes, forwardRef, ReactNode } from 'react'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  variant?: 'default' | 'filled'
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon, rightIcon, variant = 'default', className = '', ...props }, ref) => {
    const baseInput = [
      'w-full text-white placeholder-zinc-500',
      'focus:outline-none transition-all duration-200',
      'disabled:opacity-50 disabled:cursor-not-allowed',
    ]

    const variantStyles = {
      default: [
        'bg-zinc-900 border rounded-xl',
        error
          ? 'border-red-500/40 focus:border-red-400'
          : 'border-zinc-800 focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600/30',
      ],
      filled: [
        'bg-zinc-800/80 border-transparent rounded-xl',
        error
          ? 'ring-1 ring-red-500/40 focus:ring-red-400'
          : 'focus:bg-zinc-800 focus:ring-1 focus:ring-zinc-600/30',
      ],
    }

    const inputPadding = [
      leftIcon ? 'pl-11' : 'pl-4',
      rightIcon ? 'pr-11' : 'pr-4',
      'py-3.5',
    ]

    return (
      <div className="w-full">
        {label && (
          <label className="block text-[11px] text-zinc-400 uppercase tracking-wider font-medium mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            className={[
              ...baseInput,
              ...variantStyles[variant],
              ...inputPadding,
              className,
            ].join(' ')}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="mt-1.5 text-xs text-red-400">{error}</p>
        )}
        {hint && !error && (
          <p className="mt-1.5 text-xs text-zinc-500">{hint}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
export default Input

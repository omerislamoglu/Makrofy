export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
}

const styles: Record<string, string> = {
  sm: 'w-4 h-4 border-[1.5px]',
  md: 'w-6 h-6 border-2',
  lg: 'w-10 h-10 border-2',
}

export default function Spinner({ size = 'md' }: SpinnerProps) {
  return (
    <div
      className={`${styles[size]} border-white/80 border-t-transparent rounded-full animate-spin`}
      role="status"
      aria-label="Yükleniyor"
    />
  )
}

interface MakrofyLogoProps {
  variant?: 'full' | 'icon'
  size?: number
  color?: string
  className?: string
}

function MakrofyMark({
  size,
  color,
  className = '',
}: Required<Pick<MakrofyLogoProps, 'size' | 'color'>> & { className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Makrofy"
      role="img"
    >
      <rect x="10" y="10" width="100" height="100" rx="28" fill="#050505" />
      <rect x="10.75" y="10.75" width="98.5" height="98.5" rx="27.25" stroke="white" strokeOpacity="0.10" strokeWidth="1.5" />
      <path
        d="M33 80V40C33 36.8 37 35.4 39 37.9L60 64L81 37.9C83 35.4 87 36.8 87 40V80"
        stroke={color}
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M42 84H78"
        stroke={color}
        strokeOpacity="0.92"
        strokeWidth="7"
        strokeLinecap="round"
      />
    </svg>
  )
}

export default function MakrofyLogo({
  variant = 'full',
  size = 48,
  color = 'white',
  className = '',
}: MakrofyLogoProps) {
  if (variant === 'icon') {
    return <MakrofyMark size={size} color={color} className={className} />
  }

  const iconSize = size
  const wordmarkHeight = Math.round(size * 0.32)
  const gap = Math.round(size * 0.16)

  return (
    <div
      className={`flex flex-col items-center ${className}`}
      style={{ gap }}
      role="img"
      aria-label="Makrofy"
    >
      <MakrofyMark size={iconSize} color={color} />
      <span
        style={{
          fontSize: wordmarkHeight,
          fontWeight: 850,
          letterSpacing: 0,
          color,
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
          lineHeight: 1,
        }}
      >
        Makrofy
      </span>
    </div>
  )
}

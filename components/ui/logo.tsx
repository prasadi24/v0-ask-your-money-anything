"use client"
import Link from "next/link"

interface LogoProps {
  variant?: "full" | "icon"
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
  showText?: boolean
}

export function Logo({ variant = "full", size = "md", className = "", showText = true }: LogoProps) {
  const iconSizes = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-10 w-10",
    xl: "h-12 w-12",
  }

  const textSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
    xl: "text-3xl",
  }

  const LotusRupeeIcon = ({ className: iconClassName = "" }: { className?: string }) => (
    <svg viewBox="0 0 48 48" fill="none" className={iconClassName}>
      {/* 5-Petal Lotus */}
      {/* Top petal */}
      <path d="M24 8 C20 12, 20 16, 24 20 C28 16, 28 12, 24 8 Z" fill="#fbbf24" stroke="#1e293b" strokeWidth="0.5" />

      {/* Top-right petal */}
      <path d="M32 14 C28 14, 26 18, 28 22 C32 20, 36 16, 32 14 Z" fill="#fbbf24" stroke="#1e293b" strokeWidth="0.5" />

      {/* Bottom-right petal */}
      <path d="M32 34 C32 30, 28 28, 24 30 C26 34, 30 38, 32 34 Z" fill="#fbbf24" stroke="#1e293b" strokeWidth="0.5" />

      {/* Bottom-left petal */}
      <path d="M16 34 C18 38, 22 34, 24 30 C20 28, 16 30, 16 34 Z" fill="#fbbf24" stroke="#1e293b" strokeWidth="0.5" />

      {/* Top-left petal */}
      <path d="M16 14 C12 16, 16 20, 20 22 C22 18, 20 14, 16 14 Z" fill="#fbbf24" stroke="#1e293b" strokeWidth="0.5" />

      {/* Center circle for rupee symbol */}
      <circle cx="24" cy="24" r="8" fill="#1e293b" />

      {/* Rupee Symbol */}
      <g transform="translate(24, 24)">
        {/* Rupee symbol paths */}
        <path
          d="M-4 -4 L2 -4 M-4 -1 L1 -1 M-4 -4 C-2 -4, 0 -2, 0 0 C0 2, -2 4, -4 4 L2 4"
          stroke="#fbbf24"
          strokeWidth="1.2"
          fill="none"
          strokeLinecap="round"
        />
      </g>
    </svg>
  )

  if (variant === "icon") {
    return (
      <Link href="/" className={`flex items-center ${className}`}>
        <LotusRupeeIcon className={iconSizes[size]} />
      </Link>
    )
  }

  return (
    <Link href="/" className={`flex items-center space-x-3 ${className}`}>
      <LotusRupeeIcon className={iconSizes[size]} />
      {showText && (
        <div className="flex items-center">
          <span className={`font-bold text-brand-gold ${textSizes[size]}`}>Artha</span>
          <span className={`font-bold text-brand-navy ${textSizes[size]}`}>GPT</span>
        </div>
      )}
    </Link>
  )
}

// Also export as default for compatibility
export default Logo

"use client"

import Image from "next/image"
import Link from "next/link"

interface LogoProps {
  variant?: "full" | "icon"
  size?: "sm" | "md" | "lg"
  className?: string
}

export function Logo({ variant = "full", size = "md", className = "" }: LogoProps) {
  const sizeClasses = {
    sm: variant === "full" ? "h-8" : "h-6 w-6",
    md: variant === "full" ? "h-10" : "h-8 w-8",
    lg: variant === "full" ? "h-12" : "h-10 w-10",
  }

  if (variant === "icon") {
    return (
      <Link href="/" className={`flex items-center ${className}`}>
        <div className={`${sizeClasses[size]} flex items-center justify-center`}>
          <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
            <path
              d="M32 8C18.745 8 8 18.745 8 32C8 45.255 18.745 56 32 56C45.255 56 56 45.255 56 32C56 18.745 45.255 8 32 8Z"
              fill="#1e293b"
            />
            <circle cx="32" cy="28" r="8" fill="#fbbf24" />
            <circle cx="32" cy="32" r="6" fill="#fbbf24" />
            <circle cx="32" cy="36" r="4" fill="#fbbf24" />
            <path d="M28 28h8M30 26v4M34 26v4" stroke="#1e293b" strokeWidth="1.5" />
            <circle cx="44" cy="20" r="3" fill="#1e293b" />
            <circle cx="48" cy="16" r="2" fill="#1e293b" />
            <line x1="40" y1="24" x2="44" y2="20" stroke="#1e293b" strokeWidth="2" />
            <line x1="44" y1="20" x2="48" y2="16" stroke="#1e293b" strokeWidth="2" />
          </svg>
        </div>
      </Link>
    )
  }

  return (
    <Link href="/" className={`flex items-center space-x-3 ${className}`}>
      <Image
        src="/arthagpt-logo.png"
        alt="ArthaGPT - AI Financial Wisdom"
        width={size === "sm" ? 120 : size === "md" ? 150 : 180}
        height={size === "sm" ? 32 : size === "md" ? 40 : 48}
        className={sizeClasses[size]}
        priority
      />
    </Link>
  )
}

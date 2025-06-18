"use client"
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
          {/* ArthaGPT Icon - Abstract face with Lakshmi crown/bull horns */}
          <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
            {/* Main face/head shape */}
            <ellipse cx="24" cy="28" rx="12" ry="14" fill="#1e293b" />

            {/* Left horn/crown element - rising curve */}
            <path d="M16 20 C14 16, 12 14, 8 12 C10 10, 14 12, 18 16 C20 18, 18 22, 16 20 Z" fill="#fbbf24" />

            {/* Right horn/crown element - rising curve */}
            <path d="M32 20 C34 16, 36 14, 40 12 C38 10, 34 12, 30 16 C28 18, 30 22, 32 20 Z" fill="#fbbf24" />

            {/* Central crown jewel/third eye */}
            <circle cx="24" cy="18" r="3" fill="#fbbf24" />

            {/* Eyes - representing AI intelligence */}
            <circle cx="20" cy="26" r="1.5" fill="#fbbf24" />
            <circle cx="28" cy="26" r="1.5" fill="#fbbf24" />

            {/* Subtle smile - wisdom and friendliness */}
            <path d="M20 32 Q24 34, 28 32" stroke="#fbbf24" strokeWidth="1.5" fill="none" />

            {/* Sanskrit-inspired decorative elements */}
            <path d="M24 12 L24 8 M20 14 L18 10 M28 14 L30 10" stroke="#fbbf24" strokeWidth="1" />
          </svg>
        </div>
      </Link>
    )
  }

  return (
    <Link href="/" className={`flex items-center space-x-3 ${className}`}>
      <div className={`${sizeClasses[size]} flex items-center justify-center`}>
        {/* ArthaGPT Icon */}
        <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
          <ellipse cx="24" cy="28" rx="12" ry="14" fill="#1e293b" />
          <path d="M16 20 C14 16, 12 14, 8 12 C10 10, 14 12, 18 16 C20 18, 18 22, 16 20 Z" fill="#fbbf24" />
          <path d="M32 20 C34 16, 36 14, 40 12 C38 10, 34 12, 30 16 C28 18, 30 22, 32 20 Z" fill="#fbbf24" />
          <circle cx="24" cy="18" r="3" fill="#fbbf24" />
          <circle cx="20" cy="26" r="1.5" fill="#fbbf24" />
          <circle cx="28" cy="26" r="1.5" fill="#fbbf24" />
          <path d="M20 32 Q24 34, 28 32" stroke="#fbbf24" strokeWidth="1.5" fill="none" />
          <path d="M24 12 L24 8 M20 14 L18 10 M28 14 L30 10" stroke="#fbbf24" strokeWidth="1" />
        </svg>
      </div>

      {/* ArthaGPT Text */}
      <div className="flex items-center">
        <span
          className={`font-bold text-brand-gold ${size === "sm" ? "text-lg" : size === "md" ? "text-xl" : "text-2xl"}`}
        >
          Artha
        </span>
        <span
          className={`font-bold text-brand-navy ${size === "sm" ? "text-lg" : size === "md" ? "text-xl" : "text-2xl"}`}
        >
          GPT
        </span>
      </div>
    </Link>
  )
}

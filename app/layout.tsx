import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { AuthProvider } from "@/components/auth/auth-provider"
import { EnhancedNavigation } from "@/components/enhanced-navigation"

export const metadata: Metadata = {
  title: "ArthaGPT - Decode Your Wealth | AI Financial Wisdom Assistant",
  description:
    "Get instant, intelligent answers about investments, mutual funds, real estate, and financial planning powered by AI and real-time Indian market data. Ask. Understand. Prosper.",
  keywords:
    "financial AI, investment advice, mutual funds, SIP calculator, gold prices, real estate India, financial planning, artha, wealth management",
  authors: [{ name: "ArthaGPT Team" }],
  creator: "ArthaGPT",
  publisher: "ArthaGPT",
  openGraph: {
    title: "ArthaGPT - Decode Your Wealth",
    description:
      "AI-powered financial wisdom assistant for Indian investors. Get instant answers about investments, mutual funds, and financial planning.",
    url: "https://arthagpt.vercel.app",
    siteName: "ArthaGPT",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ArthaGPT - AI Financial Wisdom Assistant",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ArthaGPT - Decode Your Wealth",
    description: "AI-powered financial wisdom assistant for Indian investors",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <EnhancedNavigation />
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}

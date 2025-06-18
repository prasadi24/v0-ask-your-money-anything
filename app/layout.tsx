import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/components/auth/auth-provider"
import { EnhancedNavigation } from "@/components/enhanced-navigation"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ArthaGPT - AI Financial Wisdom Assistant",
  description:
    "Get instant, intelligent answers about investments, mutual funds, and financial planning powered by AI and real-time Indian market data",
  keywords: "financial AI, investment advice, mutual funds, SIP calculator, Indian market, wealth management, ArthaGPT",
  authors: [{ name: "ArthaGPT Team" }],
  creator: "ArthaGPT",
  publisher: "ArthaGPT",
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "32x32", type: "image/png" },
      { url: "/arthagpt-icon.png", type: "image/svg+xml" },
    ],
    apple: [{ url: "/arthagpt-icon.png", sizes: "180x180", type: "image/svg+xml" }],
  },
  openGraph: {
    title: "ArthaGPT - AI Financial Wisdom Assistant",
    description:
      "Get instant, intelligent answers about investments, mutual funds, and financial planning powered by AI",
    url: "https://arthagpt.vercel.app",
    siteName: "ArthaGPT",
    images: [
      {
        url: "/arthagpt-logo.png",
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
    title: "ArthaGPT - AI Financial Wisdom Assistant",
    description: "AI-powered financial wisdom for Indian investors",
    images: ["/arthagpt-logo.png"],
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/arthagpt-icon.png" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <EnhancedNavigation />
            <main>{children}</main>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

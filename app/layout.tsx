import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { AuthProvider } from "@/components/auth/auth-provider"

export const metadata: Metadata = {
  title: "FinGPT - Ask Your Money Anything | AI Financial Assistant",
  description:
    "Get instant, intelligent answers about investments, mutual funds, real estate, and financial planning powered by AI and real-time Indian market data.",
  keywords:
    "financial AI, investment advice, mutual funds, SIP calculator, gold prices, real estate India, financial planning",
  authors: [{ name: "FinGPT Team" }],
  creator: "FinGPT",
  publisher: "FinGPT",
  openGraph: {
    title: "FinGPT - Ask Your Money Anything",
    description:
      "AI-powered financial assistant for Indian investors. Get instant answers about investments, mutual funds, and financial planning.",
    url: "https://fingpt.vercel.app",
    siteName: "FinGPT",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "FinGPT - AI Financial Assistant",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FinGPT - Ask Your Money Anything",
    description: "AI-powered financial assistant for Indian investors",
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
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}

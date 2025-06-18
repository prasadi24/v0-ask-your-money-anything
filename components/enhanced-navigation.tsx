"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Coins, Activity, Brain, PieChart, TrendingUp, Calculator, Menu, X } from "lucide-react"
import Link from "next/link"

export function EnhancedNavigation() {
  const [isOpen, setIsOpen] = useState(false)

  const navigationItems = [
    {
      href: "/",
      label: "Home",
      icon: Coins,
      description: "ArthaGPT Homepage",
    },
    {
      href: "/ask",
      label: "Ask AI",
      icon: Brain,
      description: "Chat with AI Advisor",
      badge: "Popular",
    },
    {
      href: "/live-market",
      label: "Live Market",
      icon: Activity,
      description: "Real-time market data",
      badge: "Live",
    },
    {
      href: "/ai-advisor",
      label: "AI Advisor",
      icon: Brain,
      description: "Personal financial advisor",
    },
    {
      href: "/portfolio-analyzer",
      label: "Portfolio",
      icon: PieChart,
      description: "Analyze your investments",
    },
    {
      href: "/market-insights",
      label: "Insights",
      icon: TrendingUp,
      description: "AI market analysis",
    },
    {
      href: "/admin",
      label: "Admin",
      icon: Calculator,
      description: "Admin dashboard",
    },
  ]

  return (
    <header className="border-b bg-white/95 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Coins className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">ArthaGPT</h1>
              <p className="text-xs text-gray-600">AI Financial Wisdom</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button variant="ghost" className="flex items-center space-x-2 relative">
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <Badge
                      variant="outline"
                      className={`ml-1 text-xs ${
                        item.badge === "Live"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-blue-50 text-blue-700 border-blue-200"
                      }`}
                    >
                      {item.badge}
                    </Badge>
                  )}
                </Button>
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t">
            <nav className="grid gap-2 mt-4">
              {navigationItems.map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}>
                  <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <item.icon className="h-5 w-5 text-gray-600" />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{item.label}</span>
                        {item.badge && (
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              item.badge === "Live"
                                ? "bg-green-50 text-green-700 border-green-200"
                                : "bg-blue-50 text-blue-700 border-blue-200"
                            }`}
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

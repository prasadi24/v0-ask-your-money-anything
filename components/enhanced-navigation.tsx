"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Activity,
  Brain,
  PieChart,
  TrendingUp,
  Calculator,
  Menu,
  X,
  Newspaper,
  AlertTriangle,
  BookOpen,
  Trophy,
} from "lucide-react"
import Link from "next/link"
import { Logo } from "@/components/ui/logo"

export function EnhancedNavigation() {
  const [isOpen, setIsOpen] = useState(false)

  const navigationItems = [
    {
      href: "/",
      label: "Home",
      icon: Activity,
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
      href: "/trading-simulator",
      label: "Trading",
      icon: Calculator,
      description: "Practice trading",
      badge: "New",
    },
    {
      href: "/learn",
      label: "Learn",
      icon: BookOpen,
      description: "Interactive financial education",
      badge: "Hot",
    },
    {
      href: "/achievements",
      label: "Achievements",
      icon: Trophy,
      description: "Track your progress",
      badge: "New",
    },
    {
      href: "/financial-news",
      label: "News",
      icon: Newspaper,
      description: "AI-powered news analysis",
    },
    {
      href: "/risk-analyzer",
      label: "Risk Analysis",
      icon: AlertTriangle,
      description: "Portfolio risk assessment",
    },
    {
      href: "/admin",
      label: "Admin",
      icon: Calculator,
      description: "Admin dashboard",
    },
  ]

  return (
    <header className="border-b bg-white/95 backdrop-blur-sm sticky top-0 z-50 shadow-sm border-navy-200">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Logo variant="full" size="md" />

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2 relative hover:bg-artha-50 hover:text-navy-800"
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <Badge
                      variant="outline"
                      className={`ml-1 text-xs ${
                        item.badge === "Live"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : item.badge === "Popular"
                            ? "bg-artha-50 text-artha-700 border-artha-200"
                            : item.badge === "Hot"
                              ? "bg-red-50 text-red-700 border-red-200"
                              : "bg-purple-50 text-purple-700 border-purple-200"
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
          <Button variant="ghost" size="sm" className="lg:hidden hover:bg-artha-50" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-navy-200">
            <nav className="grid gap-2 mt-4">
              {navigationItems.map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}>
                  <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-artha-50 transition-colors">
                    <item.icon className="h-5 w-5 text-navy-600" />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-navy-800">{item.label}</span>
                        {item.badge && (
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              item.badge === "Live"
                                ? "bg-green-50 text-green-700 border-green-200"
                                : item.badge === "Popular"
                                  ? "bg-artha-50 text-artha-700 border-artha-200"
                                  : item.badge === "Hot"
                                    ? "bg-red-50 text-red-700 border-red-200"
                                    : "bg-purple-50 text-purple-700 border-purple-200"
                            }`}
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-navy-600">{item.description}</p>
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

// Default export for compatibility
export default EnhancedNavigation

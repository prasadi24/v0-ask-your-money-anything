"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Brain, Send, User, FileText, TrendingUp, Home, IndianRupee, Coins, Calculator, Target } from "lucide-react"
import Link from "next/link"
import { MarketDataWidget } from "@/components/market-data-widget"
import { FinancialCalculators } from "@/components/financial-calculators"
import { InvestmentRecommendations } from "@/components/investment-recommendations"
import { PortfolioTracker } from "@/components/portfolio-tracker"
import { ComplianceBanner } from "@/components/compliance-banner"
import { EnhancedAuthModal } from "@/components/auth/enhanced-auth-modal"
import { useAuth } from "@/components/auth/auth-provider"
import { auditLogger } from "@/lib/audit-logger"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  sources?: string[]
  category?: string
  confidence?: number
  timestamp: Date
}

const sampleQuestions = [
  {
    icon: TrendingUp,
    category: "Investments",
    questions: [
      "How did HDFC Top 100 Fund perform compared to Axis Bluechip Fund?",
      "Should I invest in SBI Gold ETF or Sovereign Gold Bonds?",
      "Compare SIP vs lump sum for large-cap mutual funds",
      "What are the tax implications of LTCG on equity mutual funds?",
    ],
  },
  {
    icon: IndianRupee,
    category: "Gold & Commodities",
    questions: [
      "Current gold prices and investment options comparison",
      "Sovereign Gold Bonds vs Gold ETF: Which is better?",
      "How does gold perform during RBI rate changes?",
      "Tax benefits of different gold investment options",
    ],
  },
  {
    icon: Home,
    category: "Real Estate",
    questions: [
      "Hyderabad vs Bangalore real estate investment comparison",
      "Should I invest in Amaravati real estate in 2024?",
      "RERA-registered projects and investment safety",
      "Rental yields in major Indian cities analysis",
    ],
  },
]

export default function EnhancedAskPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showCalculators, setShowCalculators] = useState(false)
  const [showRecommendations, setShowRecommendations] = useState(false)
  const [showPortfolio, setShowPortfolio] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)

  const { user, profile } = useAuth()

  useEffect(() => {
    // Log page visit
    auditLogger.logAction(
      "page_visit",
      "ask_page",
      {
        hasUser: !!user,
        timestamp: new Date().toISOString(),
      },
      user?.id,
    )
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Log the query
    await auditLogger.logAction(
      "query_submitted",
      "ai_assistant",
      {
        queryLength: input.length,
        queryCategory: "financial",
      },
      user?.id,
    )

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      })

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response,
        sources: data.sources,
        category: data.category,
        confidence: data.confidence,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])

      // Log the financial query for compliance
      await auditLogger.logFinancialQuery(input, data.response, data.sources || [], user?.id, data.confidence)

      // Store query log in localStorage
      if (data.queryLog) {
        const existingLogs = JSON.parse(localStorage.getItem("arthagpt_query_logs") || "[]")
        existingLogs.unshift(data.queryLog)
        localStorage.setItem("arthagpt_query_logs", JSON.stringify(existingLogs.slice(0, 100)))

        // Update query count
        const currentCount = Number.parseInt(localStorage.getItem("arthagpt_query_count") || "0")
        localStorage.setItem("arthagpt_query_count", (currentCount + 1).toString())
      }
    } catch (error) {
      console.error("Error:", error)

      // Log the error
      await auditLogger.logAction(
        "query_error",
        "ai_assistant",
        {
          error: error instanceof Error ? error.message : "Unknown error",
        },
        user?.id,
        "high",
      )

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I encountered an error while processing your question. Please try again.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSampleQuestion = (question: string) => {
    setInput(question)
  }

  const handleAuthSuccess = () => {
    // Log successful authentication
    auditLogger.logSecurityEvent({
      type: "login_attempt",
      userId: user?.id,
      details: { success: true },
      riskLevel: "low",
    })
  }

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case "mutual_fund":
        return "bg-blue-100 text-blue-800"
      case "gold":
        return "bg-yellow-100 text-yellow-800"
      case "real_estate":
        return "bg-green-100 text-green-800"
      case "insurance":
        return "bg-purple-100 text-purple-800"
      case "tax":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getConfidenceColor = (confidence?: number) => {
    if (!confidence) return "bg-gray-100 text-gray-800"
    if (confidence >= 80) return "bg-green-100 text-green-800"
    if (confidence >= 60) return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Coins className="h-8 w-8 text-artha-500" />
            <h1 className="text-2xl font-bold text-indigo-800">ArthaGPT</h1>
          </Link>
          <nav className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => setShowCalculators(!showCalculators)}
              className="flex items-center space-x-2"
            >
              <Calculator className="h-4 w-4" />
              <span>Calculators</span>
            </Button>
            <Button
              variant="ghost"
              onClick={() => setShowRecommendations(!showRecommendations)}
              className="flex items-center space-x-2"
            >
              <Target className="h-4 w-4" />
              <span>Recommendations</span>
            </Button>
            <Button
              variant="ghost"
              onClick={() => setShowPortfolio(!showPortfolio)}
              className="flex items-center space-x-2"
            >
              <TrendingUp className="h-4 w-4" />
              <span>Portfolio</span>
            </Button>
            <Link href="/admin">
              <Button variant="ghost">Admin</Button>
            </Link>
            {user ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm">Welcome, {profile?.full_name || user.email}</span>
                <Button variant="outline" size="sm">
                  Account
                </Button>
              </div>
            ) : (
              <Button onClick={() => setShowAuthModal(true)} className="bg-indigo-800 hover:bg-indigo-900">
                Sign In
              </Button>
            )}
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Compliance Banner */}
        <div className="mb-6">
          <ComplianceBanner />
        </div>

        {/* Market Data Widget */}
        <div className="mb-6">
          <MarketDataWidget />
        </div>

        {/* Financial Calculators */}
        {showCalculators && (
          <div className="mb-6">
            <FinancialCalculators />
          </div>
        )}

        {/* Investment Recommendations */}
        {showRecommendations && (
          <div className="mb-6">
            <InvestmentRecommendations />
          </div>
        )}

        {/* Portfolio Tracker */}
        {showPortfolio && (
          <div className="mb-6">
            <PortfolioTracker />
          </div>
        )}

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar with Sample Questions */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Sample Questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {sampleQuestions.map((category, index) => (
                  <div key={index}>
                    <div className="flex items-center space-x-2 mb-2">
                      <category.icon className="h-4 w-4 text-artha-600" />
                      <h3 className="font-medium text-sm">{category.category}</h3>
                    </div>
                    <div className="space-y-1">
                      {category.questions.map((question, qIndex) => (
                        <button
                          key={qIndex}
                          onClick={() => handleSampleQuestion(question)}
                          className="text-left text-xs text-gray-600 hover:text-navy-600 block w-full p-2 rounded hover:bg-navy-50 transition-colors"
                        >
                          {question}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Chat Area */}
          <div className="lg:col-span-3">
            <Card className="h-[600px] flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Coins className="h-5 w-5 text-artha-600" />
                  <span>Ask Your Financial Questions</span>
                  {user && (
                    <Badge variant="outline" className="ml-auto">
                      {profile?.subscription_tier || "Free"} Plan
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col">
                {/* Messages Area */}
                <ScrollArea className="flex-1 mb-4">
                  {messages.length === 0 ? (
                    <div className="text-center py-12">
                      <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Welcome to ArthaGPT!</h3>
                      <p className="text-gray-600 mb-4">
                        Ask me anything about investments, real estate, mutual funds, or financial planning.
                      </p>
                      <p className="text-sm text-gray-500">
                        Try clicking on one of the sample questions on the left to get started.
                      </p>
                      {!user && (
                        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm text-blue-700">
                            <Button
                              variant="link"
                              onClick={() => setShowAuthModal(true)}
                              className="text-blue-700 p-0 h-auto"
                            >
                              Sign in
                            </Button>{" "}
                            to save your conversations and get personalized recommendations.
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`flex space-x-3 max-w-3xl ${message.role === "user" ? "flex-row-reverse space-x-reverse" : ""}`}
                          >
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>
                                {message.role === "user" ? <User className="h-4 w-4" /> : <Brain className="h-4 w-4" />}
                              </AvatarFallback>
                            </Avatar>
                            <div
                              className={`rounded-lg p-4 ${
                                message.role === "user" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-900"
                              }`}
                            >
                              <p className="whitespace-pre-wrap">{message.content}</p>

                              {/* Enhanced metadata for assistant messages */}
                              {message.role === "assistant" && (
                                <div className="mt-3 space-y-2">
                                  {/* Category and Confidence */}
                                  <div className="flex items-center space-x-2">
                                    {message.category && (
                                      <Badge className={getCategoryColor(message.category)}>
                                        {message.category.replace("_", " ").toUpperCase()}
                                      </Badge>
                                    )}
                                    {message.confidence && (
                                      <Badge className={getConfidenceColor(message.confidence)}>
                                        {message.confidence}% confidence
                                      </Badge>
                                    )}
                                  </div>

                                  {/* Sources */}
                                  {message.sources && message.sources.length > 0 && (
                                    <div className="pt-3 border-t border-gray-300">
                                      <p className="text-sm font-medium mb-2 flex items-center">
                                        <FileText className="h-4 w-4 mr-1" />
                                        Sources:
                                      </p>
                                      <ul className="text-sm space-y-1">
                                        {message.sources.map((source, index) => (
                                          <li key={index} className="text-gray-600">
                                            • {source}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                      {isLoading && (
                        <div className="flex justify-start">
                          <div className="flex space-x-3 max-w-3xl">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>
                                <Brain className="h-4 w-4" />
                              </AvatarFallback>
                            </Avatar>
                            <div className="bg-gray-100 rounded-lg p-4">
                              <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                <div
                                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                  style={{ animationDelay: "0.1s" }}
                                ></div>
                                <div
                                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                  style={{ animationDelay: "0.2s" }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </ScrollArea>

                {/* Input Form */}
                <form onSubmit={handleSubmit} className="flex space-x-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about investments, real estate, mutual funds..."
                    disabled={isLoading}
                    className="flex-1"
                  />
                  <Button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="bg-indigo-800 hover:bg-indigo-900"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>

                {/* Usage indicator for free users */}
                {!user && (
                  <div className="mt-2 text-xs text-gray-500 text-center">
                    Free users: 10 questions per day •{" "}
                    <Button variant="link" onClick={() => setShowAuthModal(true)} className="text-xs p-0 h-auto">
                      Sign up for unlimited access
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Enhanced Auth Modal */}
      <EnhancedAuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} onSuccess={handleAuthSuccess} />
    </div>
  )
}

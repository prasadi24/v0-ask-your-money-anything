"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Logo } from "@/components/logo"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, User, TrendingUp, AlertCircle, CheckCircle, Clock, MessageCircle } from "lucide-react"
import { MarkdownRenderer } from "@/components/markdown-renderer"

interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
  confidence?: number
  sources?: string[]
  category?: string
}

interface QueryLog {
  id: string
  query: string
  response: string
  timestamp: string
  confidence: number
  category: string
  model: string
}

export default function AskPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content:
        "Hello! I'm **ArthaGPT**, your AI financial advisor. Ask me anything about:\n\n• 📈 **Investments** - Mutual funds, stocks, SIPs\n• 💰 **Tax Planning** - Section 80C, LTCG, ELSS\n• 🏠 **Real Estate** - Property vs REITs\n• 🥇 **Gold & Commodities** - ETFs, bonds, digital gold\n\nI'm here to help with your financial questions! 🇮🇳",
      sender: "ai",
      timestamp: new Date(),
      confidence: 100,
      sources: ["ArthaGPT Knowledge Base"],
      category: "welcome",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [queryLogs, setQueryLogs] = useState<QueryLog[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sampleQuestions = [
    "How did Axis Bluechip Fund perform in the last 5 years?",
    "Compare SIP vs lump sum for HDFC Top 100 Fund",
    "Which SEBI-approved mutual funds have the lowest expense ratio?",
    "What are the best Section 80C investment options?",
    "How is LTCG tax calculated on mutual funds?",
    "ELSS vs PPF - which is better for tax saving?",
    "Is it better to buy property or invest in REITs?",
    "Gold ETF vs Sovereign Gold Bonds - which is better?",
    "How much gold should be in my investment portfolio?",
    "Is digital gold a good investment option?",
    "Should I invest in small cap or large cap funds now?",
    "What are the tax implications of switching mutual funds?",
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input.trim() }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content:
          data.response || "I apologize, but I'm having trouble processing your request right now. Please try again.",
        sender: "ai",
        timestamp: new Date(),
        confidence: data.confidence || 0,
        sources: data.sources || [],
        category: data.category || "general",
      }

      setMessages((prev) => [...prev, aiMessage])

      // Log the query if provided
      if (data.queryLog) {
        setQueryLogs((prev) => [data.queryLog, ...prev.slice(0, 9)]) // Keep last 10 logs
      }
    } catch (error) {
      console.error("Error:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I encountered an error while processing your question. Please try again in a moment.",
        sender: "ai",
        timestamp: new Date(),
        confidence: 0,
        sources: [],
        category: "error",
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSampleQuestion = (question: string) => {
    setInput(question)
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return "text-green-600"
    if (confidence >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getConfidenceIcon = (confidence: number) => {
    if (confidence >= 80) return <CheckCircle className="w-3 h-3" />
    if (confidence >= 60) return <Clock className="w-3 h-3" />
    return <AlertCircle className="w-3 h-3" />
  }

  return (
    <div className="container mx-auto py-8 max-w-6xl px-4">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sample Questions Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <MessageCircle className="w-5 h-5 text-brand-gold" />
                <span>Quick Questions</span>
              </CardTitle>
              <p className="text-sm text-gray-600">Click to ask instantly</p>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <div className="space-y-2">
                  {sampleQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleSampleQuestion(question)}
                      className="text-left text-sm text-gray-700 hover:text-brand-navy hover:bg-brand-gold/10 p-3 rounded-lg transition-all w-full border border-transparent hover:border-brand-gold/30 hover:shadow-sm"
                      disabled={isLoading}
                    >
                      <div className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-brand-gold rounded-full mt-2 flex-shrink-0"></div>
                        <span className="leading-relaxed">{question}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Main Chat Window */}
        <div className="lg:col-span-3">
          <Card className="h-[700px] flex flex-col shadow-lg">
            {/* Chat Header */}
            <CardHeader className="flex-shrink-0 border-b bg-gradient-to-r from-brand-navy to-brand-navy/90 text-white">
              <div className="flex items-center space-x-3">
                <Logo variant="icon" size="md" />
                <div className="flex-1">
                  <CardTitle className="flex items-center space-x-2 text-white">
                    <span>ArthaGPT</span>
                    <span className="text-brand-gold text-sm font-normal">• AI Financial Advisor</span>
                  </CardTitle>
                  <p className="text-sm text-gray-200 mt-1">
                    💬 Chat with AI • Get personalized financial advice • Powered by advanced AI
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-300">Online</div>
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                </div>
              </div>
            </CardHeader>

            {/* Chat Messages Area */}
            <CardContent className="flex-1 flex flex-col p-0 bg-gray-50">
              <ScrollArea className="flex-1 px-4 py-6">
                <div className="space-y-4 max-w-none">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex items-end space-x-2 ${
                        message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""
                      }`}
                    >
                      {/* Avatar */}
                      <Avatar className="w-8 h-8 flex-shrink-0">
                        <AvatarFallback
                          className={
                            message.sender === "user" ? "bg-brand-navy text-white" : "bg-brand-gold text-brand-navy"
                          }
                        >
                          {message.sender === "user" ? (
                            <User className="w-4 h-4" />
                          ) : (
                            <Logo variant="icon" size="sm" showText={false} />
                          )}
                        </AvatarFallback>
                      </Avatar>

                      {/* Message Bubble */}
                      <div
                        className={`flex flex-col max-w-[75%] ${message.sender === "user" ? "items-end" : "items-start"}`}
                      >
                        <div
                          className={`px-4 py-3 rounded-2xl shadow-sm ${
                            message.sender === "user"
                              ? "bg-brand-navy text-white rounded-br-md"
                              : "bg-white text-gray-900 border border-gray-200 rounded-bl-md"
                          }`}
                        >
                          {message.sender === "ai" ? (
                            <MarkdownRenderer content={message.content} />
                          ) : (
                            <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</div>
                          )}
                        </div>

                        {/* Message Metadata */}
                        <div className="flex items-center space-x-2 mt-1 px-2">
                          <span className="text-xs text-gray-500">
                            {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>

                          {message.sender === "ai" && message.confidence !== undefined && (
                            <>
                              <span className="text-xs text-gray-400">•</span>
                              <div
                                className={`flex items-center space-x-1 text-xs ${getConfidenceColor(message.confidence)}`}
                              >
                                {getConfidenceIcon(message.confidence)}
                                <span>{message.confidence}%</span>
                              </div>
                            </>
                          )}

                          {message.category && message.category !== "welcome" && (
                            <>
                              <span className="text-xs text-gray-400">•</span>
                              <Badge variant="outline" className="text-xs h-4">
                                {message.category}
                              </Badge>
                            </>
                          )}
                        </div>

                        {/* Sources */}
                        {message.sender === "ai" && message.sources && message.sources.length > 0 && (
                          <div className="mt-1 px-2">
                            <div className="text-xs text-gray-500 flex items-center space-x-1">
                              <TrendingUp className="w-3 h-3" />
                              <span>Sources: {message.sources.slice(0, 2).join(", ")}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Loading State */}
                  {isLoading && (
                    <div className="flex items-end space-x-2">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-brand-gold text-brand-navy">
                          <Logo variant="icon" size="sm" showText={false} />
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl rounded-bl-md shadow-sm">
                        <div className="flex items-center space-x-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-brand-gold rounded-full animate-bounce"></div>
                            <div
                              className="w-2 h-2 bg-brand-gold rounded-full animate-bounce"
                              style={{ animationDelay: "0.1s" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-brand-gold rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600">ArthaGPT is typing...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div ref={messagesEndRef} />
              </ScrollArea>

              {/* Chat Input */}
              <div className="border-t bg-white p-4">
                <form onSubmit={handleSubmit} className="flex space-x-3">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your financial question here..."
                    disabled={isLoading}
                    className="flex-1 rounded-full border-gray-300 focus:border-brand-gold focus:ring-brand-gold"
                  />
                  <Button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="bg-brand-navy hover:bg-brand-navy/90 text-white rounded-full px-6 shadow-lg hover:shadow-xl transition-all"
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </form>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  ArthaGPT provides educational information. Always consult qualified financial advisors for
                  personalized advice.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

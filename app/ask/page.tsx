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
import { Send, User, TrendingUp, AlertCircle, CheckCircle, Clock } from "lucide-react"
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
    {
      category: "📈 Investments",
      questions: [
        "How did Axis Bluechip Fund perform in the last 5 years?",
        "Compare SIP vs lump sum for HDFC Top 100 Fund",
        "Which SEBI-approved mutual funds have the lowest expense ratio?",
        "Should I invest in small cap or large cap funds now?",
      ],
    },
    {
      category: "💰 Tax Planning",
      questions: [
        "What are the best Section 80C investment options?",
        "How is LTCG tax calculated on mutual funds?",
        "ELSS vs PPF - which is better for tax saving?",
        "What are the tax implications of switching mutual funds?",
      ],
    },
    {
      category: "🏠 Real Estate",
      questions: [
        "Is it better to buy property or invest in REITs?",
        "How to calculate home loan EMI and tax benefits?",
        "What are the stamp duty rates in major Indian cities?",
        "Should I prepay my home loan or invest in mutual funds?",
      ],
    },
    {
      category: "🥇 Gold & Commodities",
      questions: [
        "Gold ETF vs Sovereign Gold Bonds - which is better?",
        "How much gold should be in my investment portfolio?",
        "What are the tax implications of selling gold?",
        "Is digital gold a good investment option?",
      ],
    },
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
    <div className="container mx-auto py-8 max-w-7xl px-4">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sample Questions Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-brand-gold" />
                <span>Sample Questions</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 max-h-[500px] overflow-y-auto">
              {sampleQuestions.map((section, sectionIndex) => (
                <div key={sectionIndex}>
                  <h4 className="font-semibold text-sm mb-2 text-brand-navy">{section.category}</h4>
                  <div className="space-y-2">
                    {section.questions.map((question, questionIndex) => (
                      <button
                        key={questionIndex}
                        onClick={() => handleSampleQuestion(question)}
                        className="text-left text-sm text-gray-600 hover:text-brand-navy hover:bg-brand-gold/10 p-2 rounded-md transition-colors w-full border border-transparent hover:border-brand-gold/20"
                        disabled={isLoading}
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Queries */}
          {queryLogs.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Queries</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[200px]">
                  <div className="space-y-2">
                    {queryLogs.slice(0, 10).map((log) => (
                      <div key={log.id} className="text-xs p-2 bg-gray-50 rounded">
                        <div className="font-medium truncate">{log.query}</div>
                        <div className="text-gray-500 mt-1">
                          {new Date(log.timestamp).toLocaleTimeString()} • {log.model}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Main Chat Area */}
        <div className="lg:col-span-3">
          <Card className="h-[700px] flex flex-col">
            <CardHeader className="flex-shrink-0 border-b">
              <div className="flex items-center space-x-3">
                <Logo variant="icon" size="md" />
                <div className="flex-1">
                  <CardTitle className="flex items-center space-x-2">
                    <span className="text-brand-gold">Artha</span>
                    <span className="text-brand-navy">GPT</span>
                    <span className="text-gray-600 text-sm font-normal">- AI Financial Advisor</span>
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    Get personalized financial advice powered by AI • Data for demonstration purposes
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col p-0">
              {/* Messages Area with Proper Scrolling */}
              <ScrollArea className="flex-1 px-6 py-4">
                <div className="space-y-6">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex items-start space-x-3 ${
                        message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""
                      }`}
                    >
                      <Avatar className="w-10 h-10 flex-shrink-0">
                        <AvatarFallback
                          className={
                            message.sender === "user" ? "bg-brand-navy text-white" : "bg-brand-gold text-brand-navy"
                          }
                        >
                          {message.sender === "user" ? (
                            <User className="w-5 h-5" />
                          ) : (
                            <Logo variant="icon" size="sm" showText={false} />
                          )}
                        </AvatarFallback>
                      </Avatar>

                      <div className={`flex-1 ${message.sender === "user" ? "text-right" : ""}`}>
                        <div
                          className={`inline-block p-4 rounded-lg max-w-[90%] ${
                            message.sender === "user"
                              ? "bg-brand-navy text-white rounded-br-sm"
                              : "bg-white text-gray-900 border border-gray-200 shadow-sm rounded-bl-sm"
                          }`}
                        >
                          {message.sender === "ai" ? (
                            <MarkdownRenderer content={message.content} />
                          ) : (
                            <div className="whitespace-pre-wrap">{message.content}</div>
                          )}
                        </div>

                        {/* AI Message Metadata */}
                        {message.sender === "ai" && message.confidence !== undefined && (
                          <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                            <div className={`flex items-center space-x-1 ${getConfidenceColor(message.confidence)}`}>
                              {getConfidenceIcon(message.confidence)}
                              <span>Confidence: {message.confidence}%</span>
                            </div>
                            {message.sources && message.sources.length > 0 && (
                              <div className="flex items-center space-x-1">
                                <TrendingUp className="w-3 h-3" />
                                <span>Sources: {message.sources.slice(0, 2).join(", ")}</span>
                              </div>
                            )}
                            {message.category && (
                              <Badge variant="outline" className="text-xs">
                                {message.category}
                              </Badge>
                            )}
                          </div>
                        )}

                        <div className="text-xs text-gray-400 mt-1">{message.timestamp.toLocaleTimeString()}</div>
                      </div>
                    </div>
                  ))}

                  {/* Loading State with Logo */}
                  {isLoading && (
                    <div className="flex items-start space-x-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-brand-gold text-brand-navy">
                          <Logo variant="icon" size="sm" showText={false} />
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-white border border-gray-200 shadow-sm p-4 rounded-lg rounded-bl-sm">
                        <div className="flex items-center space-x-3">
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
                          <span className="text-sm text-gray-600">ArthaGPT is analyzing your question...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div ref={messagesEndRef} />
              </ScrollArea>

              {/* Input Area */}
              <div className="border-t p-4 bg-gray-50">
                <form onSubmit={handleSubmit} className="flex space-x-3">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about investments, real estate, mutual funds, tax planning..."
                    disabled={isLoading}
                    className="flex-1 bg-white"
                  />
                  <Button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="bg-brand-navy hover:bg-brand-navy/90 text-white px-6"
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

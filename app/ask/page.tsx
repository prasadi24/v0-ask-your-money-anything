"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Brain, Send, User, FileText, TrendingUp, Home, DollarSign } from "lucide-react"
import Link from "next/link"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  sources?: string[]
  timestamp: Date
}

const sampleQuestions = [
  {
    icon: TrendingUp,
    category: "Investments",
    questions: [
      "How did Axis Bluechip Fund perform in the last 5 years?",
      "Compare SIP vs lump sum for HDFC Top 100 Fund",
      "Which mutual funds have the lowest expense ratio?",
    ],
  },
  {
    icon: DollarSign,
    category: "Gold & Commodities",
    questions: [
      "What are the current gold prices and trends?",
      "Should I invest in gold ETFs or physical gold?",
      "How does gold perform during inflation?",
    ],
  },
  {
    icon: Home,
    category: "Real Estate",
    questions: [
      "Should I invest in Amaravati real estate now?",
      "What are the property trends in Vijayawada?",
      "Compare rental yields in different areas",
    ],
  },
]

export default function AskPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

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
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error:", error)
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-orange-600" />
            <h1 className="text-2xl font-bold text-gray-900">FinGPT</h1>
          </Link>
          <nav className="flex items-center space-x-4">
            <Link href="/admin">
              <Button variant="ghost">Admin</Button>
            </Link>
            <Button>Sign In</Button>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
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
                      <category.icon className="h-4 w-4 text-orange-600" />
                      <h3 className="font-medium text-sm">{category.category}</h3>
                    </div>
                    <div className="space-y-1">
                      {category.questions.map((question, qIndex) => (
                        <button
                          key={qIndex}
                          onClick={() => handleSampleQuestion(question)}
                          className="text-left text-xs text-gray-600 hover:text-orange-600 block w-full p-2 rounded hover:bg-orange-50 transition-colors"
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
                  <Brain className="h-5 w-5 text-orange-600" />
                  <span>Ask Your Financial Questions</span>
                </CardTitle>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col">
                {/* Messages Area */}
                <ScrollArea className="flex-1 mb-4">
                  {messages.length === 0 ? (
                    <div className="text-center py-12">
                      <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Welcome to FinGPT!</h3>
                      <p className="text-gray-600 mb-4">
                        Ask me anything about investments, real estate, mutual funds, or financial planning.
                      </p>
                      <p className="text-sm text-gray-500">
                        Try clicking on one of the sample questions on the left to get started.
                      </p>
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
                                message.role === "user" ? "bg-orange-600 text-white" : "bg-gray-100 text-gray-900"
                              }`}
                            >
                              <p className="whitespace-pre-wrap">{message.content}</p>
                              {message.sources && message.sources.length > 0 && (
                                <div className="mt-3 pt-3 border-t border-gray-300">
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
                  <Button type="submit" disabled={isLoading || !input.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

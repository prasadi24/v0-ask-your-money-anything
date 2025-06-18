"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Brain, MessageSquare, Shield, Send, FileText, Target, Calculator, Zap } from "lucide-react"
import { VoiceAssistant } from "@/components/voice-assistant"

interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  confidence?: number
  sources?: string[]
}

interface FinancialProfile {
  age: number
  income: number
  riskTolerance: "conservative" | "moderate" | "aggressive"
  goals: string[]
  timeHorizon: number
}

export default function AIAdvisorPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hello! I'm your AI Financial Advisor powered by advanced language models. I can help you with investment strategies, portfolio analysis, tax planning, and personalized financial advice. What would you like to discuss today?",
      timestamp: new Date(),
      confidence: 95,
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedModel, setSelectedModel] = useState<"groq" | "openai">("groq")
  const [profile, setProfile] = useState<FinancialProfile>({
    age: 30,
    income: 1000000,
    riskTolerance: "moderate",
    goals: ["retirement", "house"],
    timeHorizon: 10,
  })

  const handleSubmit = async (query: string) => {
    if (!query.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: query,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Use the selected AI model
      const endpoint = selectedModel === "groq" ? "/api/groq-chat" : "/api/openai-chat"

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: query,
          context: `User Profile: Age ${profile.age}, Income ₹${profile.income.toLocaleString()}, Risk Tolerance: ${profile.riskTolerance}, Goals: ${profile.goals.join(", ")}, Time Horizon: ${profile.timeHorizon} years`,
          userProfile: profile,
        }),
      })

      const data = await response.json()

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
        confidence: data.confidence || 90,
        sources: data.sources,
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error:", error)
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I apologize, but I encountered an error processing your request. Please try again.",
        timestamp: new Date(),
        confidence: 0,
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleVoiceQuery = (query: string) => {
    setInput(query)
    handleSubmit(query)
  }

  const quickQuestions = [
    "Analyze my portfolio allocation for a 30-year-old with moderate risk tolerance",
    "What are the best tax-saving investments under Section 80C?",
    "Should I invest in large-cap or mid-cap mutual funds right now?",
    "How much should I invest monthly to reach ₹1 crore in 15 years?",
    "Compare ELSS vs PPF for tax saving and returns",
    "What's the ideal emergency fund size for my income level?",
  ]

  const getConfidenceColor = (confidence?: number) => {
    if (!confidence) return "bg-gray-100 text-gray-800"
    if (confidence >= 90) return "bg-green-100 text-green-800"
    if (confidence >= 70) return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Brain className="h-6 w-6 text-purple-600" />
                <h1 className="text-3xl font-bold">AI Financial Advisor</h1>
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                  Powered by {selectedModel === "groq" ? "Groq" : "OpenAI"}
                </Badge>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant={selectedModel === "groq" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedModel("groq")}
              >
                <Zap className="h-4 w-4 mr-1" />
                Groq (Fast)
              </Button>
              <Button
                variant={selectedModel === "openai" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedModel("openai")}
              >
                <Brain className="h-4 w-4 mr-1" />
                OpenAI (Advanced)
              </Button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Your Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Age</label>
                  <Input
                    type="number"
                    value={profile.age}
                    onChange={(e) => setProfile({ ...profile, age: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Annual Income (₹)</label>
                  <Input
                    type="number"
                    value={profile.income}
                    onChange={(e) => setProfile({ ...profile, income: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Risk Tolerance</label>
                  <select
                    value={profile.riskTolerance}
                    onChange={(e) => setProfile({ ...profile, riskTolerance: e.target.value as any })}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="conservative">Conservative</option>
                    <option value="moderate">Moderate</option>
                    <option value="aggressive">Aggressive</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Quick Questions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {quickQuestions.slice(0, 4).map((question, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      className="w-full text-left justify-start h-auto p-2 text-xs"
                      onClick={() => handleSubmit(question)}
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Chat Area */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              {/* Voice Assistant */}
              <VoiceAssistant
                onVoiceQuery={handleVoiceQuery}
                isProcessing={isLoading}
                response={
                  messages[messages.length - 1]?.role === "assistant" ? messages[messages.length - 1].content : ""
                }
              />

              {/* Chat Interface */}
              <Card className="h-[600px] flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MessageSquare className="h-5 w-5" />
                    <span>AI Financial Consultation</span>
                    <Badge variant="outline">{messages.length - 1} messages</Badge>
                  </CardTitle>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col">
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-3xl rounded-lg p-4 ${
                            message.role === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{message.content}</p>

                          {message.role === "assistant" && (
                            <div className="mt-3 space-y-2">
                              <div className="flex items-center space-x-2">
                                <Badge className={getConfidenceColor(message.confidence)}>
                                  {message.confidence}% confidence
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {selectedModel === "groq" ? "Groq Mixtral" : "OpenAI GPT-4"}
                                </Badge>
                              </div>

                              {message.sources && message.sources.length > 0 && (
                                <div className="pt-2 border-t border-gray-300">
                                  <p className="text-sm font-medium mb-1 flex items-center">
                                    <FileText className="h-3 w-3 mr-1" />
                                    Sources:
                                  </p>
                                  <ul className="text-xs space-y-1">
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
                    ))}

                    {isLoading && (
                      <div className="flex justify-start">
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
                    )}
                  </div>

                  {/* Input Form */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      handleSubmit(input)
                    }}
                    className="flex space-x-2"
                  >
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask about investments, tax planning, portfolio optimization..."
                      disabled={isLoading}
                      className="flex-1"
                    />
                    <Button type="submit" disabled={isLoading || !input.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* AI Features */}
              <div className="grid md:grid-cols-3 gap-4">
                <Card className="border-blue-200 bg-blue-50">
                  <CardContent className="p-4 text-center">
                    <Calculator className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <h3 className="font-semibold mb-1">Smart Calculations</h3>
                    <p className="text-sm text-gray-600">SIP, EMI, retirement planning with AI insights</p>
                  </CardContent>
                </Card>

                <Card className="border-green-200 bg-green-50">
                  <CardContent className="p-4 text-center">
                    <Target className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <h3 className="font-semibold mb-1">Goal Planning</h3>
                    <p className="text-sm text-gray-600">Personalized strategies for your financial goals</p>
                  </CardContent>
                </Card>

                <Card className="border-purple-200 bg-purple-50">
                  <CardContent className="p-4 text-center">
                    <Shield className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <h3 className="font-semibold mb-1">Risk Analysis</h3>
                    <p className="text-sm text-gray-600">AI-powered portfolio risk assessment</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

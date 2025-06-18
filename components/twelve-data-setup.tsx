"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Key, CheckCircle, AlertCircle, Info, Copy, Eye, EyeOff, Star, Zap, Globe } from "lucide-react"

export function TwelveDataSetup() {
  const [showApiKey, setShowApiKey] = useState(false)
  const [copiedKey, setCopiedKey] = useState(false)

  const demoApiKey = "demo"

  const copyApiKey = () => {
    navigator.clipboard.writeText(demoApiKey)
    setCopiedKey(true)
    setTimeout(() => setCopiedKey(false), 2000)
  }

  const plans = [
    {
      name: "Free",
      price: "$0/month",
      requests: "800 requests/day",
      features: ["Real-time data", "Indian stocks (NSE/BSE)", "Forex rates", "Commodities", "Basic support"],
      limitations: ["800 API calls per day", "No historical data", "Basic endpoints only"],
      recommended: true,
      color: "green",
    },
    {
      name: "Basic",
      price: "$12/month",
      requests: "5,000 requests/day",
      features: ["Everything in Free", "Historical data", "Technical indicators", "More endpoints", "Email support"],
      limitations: ["5,000 API calls per day", "Limited historical data"],
      color: "blue",
    },
    {
      name: "Pro",
      price: "$79/month",
      requests: "50,000 requests/day",
      features: [
        "Everything in Basic",
        "Full historical data",
        "WebSocket streaming",
        "Priority support",
        "Advanced analytics",
      ],
      limitations: ["50,000 API calls per day"],
      color: "purple",
    },
  ]

  const setupSteps = [
    {
      step: 1,
      title: "Sign Up for Twelve Data",
      description: "Create a free account at twelvedata.com",
      action: "Visit Website",
      link: "https://twelvedata.com/",
    },
    {
      step: 2,
      title: "Get Your API Key",
      description: "Navigate to your dashboard and copy your API key",
      action: "Dashboard",
      link: "https://twelvedata.com/account/api-key",
    },
    {
      step: 3,
      title: "Add to Environment",
      description: "Add your API key to your .env file",
      code: "MARKET_API_KEY=your_twelve_data_api_key",
    },
    {
      step: 4,
      title: "Test Integration",
      description: "Restart your app and test the market data features",
    },
  ]

  const supportedData = [
    {
      category: "Indian Stocks",
      items: ["NSE stocks", "BSE stocks", "Real-time quotes", "Historical data"],
      icon: "🇮🇳",
    },
    {
      category: "Indices",
      items: ["Nifty 50", "Sensex", "Bank Nifty", "Sector indices"],
      icon: "📊",
    },
    {
      category: "Forex",
      items: ["USD/INR", "EUR/INR", "GBP/INR", "Major pairs"],
      icon: "💱",
    },
    {
      category: "Commodities",
      items: ["Gold", "Silver", "Crude Oil", "Natural Gas"],
      icon: "🥇",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3 text-blue-800">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Zap className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Twelve Data Integration</h2>
              <p className="text-sm text-blue-600 font-normal">Professional market data API with generous free tier</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm">800 free requests/day</span>
            </div>
            <div className="flex items-center space-x-2">
              <Globe className="h-5 w-5 text-blue-500" />
              <span className="text-sm">Indian market coverage</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <span className="text-sm">Real-time data</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Status */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-green-800">
            <CheckCircle className="h-5 w-5" />
            <span>Current Status: Demo Mode</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-green-700">
          <p className="mb-4">
            ArthaGPT is configured to work with Twelve Data API. Currently running in demo mode with realistic mock
            data.
          </p>

          <div className="bg-white p-4 rounded-lg border border-green-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Current API Key:</span>
              <Button variant="outline" size="sm" onClick={() => setShowApiKey(!showApiKey)}>
                {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <code className="flex-1 p-2 bg-gray-100 rounded text-sm">{showApiKey ? demoApiKey : "•".repeat(20)}</code>
              <Button variant="outline" size="sm" onClick={copyApiKey} className={copiedKey ? "text-green-600" : ""}>
                <Copy className="h-4 w-4" />
                {copiedKey ? "Copied!" : "Copy"}
              </Button>
            </div>
            <p className="text-xs text-gray-600 mt-2">Replace "demo" with your actual Twelve Data API key</p>
          </div>
        </CardContent>
      </Card>

      {/* Pricing Plans */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Key className="h-5 w-5 text-blue-600" />
            <span>Twelve Data Pricing Plans</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={`relative ${
                  plan.recommended ? "border-green-200 bg-green-50 ring-2 ring-green-200" : "border-gray-200"
                }`}
              >
                {plan.recommended && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-green-600 text-white">
                      <Star className="h-3 w-3 mr-1" />
                      Recommended
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center">
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <div className="text-2xl font-bold text-blue-600">{plan.price}</div>
                  <div className="text-sm text-gray-600">{plan.requests}</div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm mb-2 text-green-600">Features:</h4>
                    <ul className="text-sm space-y-1">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm mb-2 text-orange-600">Limitations:</h4>
                    <ul className="text-sm space-y-1">
                      {plan.limitations.map((limitation, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <AlertCircle className="h-3 w-3 text-orange-500" />
                          <span>{limitation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Setup Guide */}
      <Card>
        <CardHeader>
          <CardTitle>Setup Guide</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {setupSteps.map((step) => (
              <div key={step.step} className="flex items-start space-x-4">
                <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                  {step.step}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{step.title}</h3>
                  <p className="text-gray-600 text-sm mb-2">{step.description}</p>

                  {step.code && <code className="block p-2 bg-gray-100 rounded text-sm mb-2">{step.code}</code>}

                  {step.link && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={step.link} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        {step.action}
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Supported Data */}
      <Card>
        <CardHeader>
          <CardTitle>Supported Market Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {supportedData.map((data) => (
              <Card key={data.category} className="border-gray-200">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <span className="text-2xl">{data.icon}</span>
                    <span>{data.category}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {data.items.map((item) => (
                      <Badge key={item} variant="secondary" className="text-xs">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Start */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-blue-800">
            <Info className="h-5 w-5" />
            <span>Quick Start</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-blue-700">
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold mb-2">For Development (Free):</h4>
              <ol className="text-sm space-y-1 list-decimal list-inside">
                <li>
                  Sign up at{" "}
                  <a href="https://twelvedata.com/" className="underline" target="_blank" rel="noreferrer">
                    twelvedata.com
                  </a>
                </li>
                <li>Get your free API key (800 requests/day)</li>
                <li>Replace "demo" in your .env file with your real API key</li>
                <li>Restart your application</li>
              </ol>
            </div>

            <div className="bg-white p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold mb-2">Environment Variable:</h4>
              <code className="block p-2 bg-gray-100 rounded text-sm">
                MARKET_API_KEY=your_twelve_data_api_key_here
              </code>
            </div>

            <div className="bg-white p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold mb-2">Why Twelve Data?</h4>
              <ul className="text-sm space-y-1">
                <li>
                  ✅ <strong>Generous Free Tier:</strong> 800 requests/day at no cost
                </li>
                <li>
                  ✅ <strong>Indian Market Coverage:</strong> NSE, BSE stocks and indices
                </li>
                <li>
                  ✅ <strong>Real-time Data:</strong> Live market prices and updates
                </li>
                <li>
                  ✅ <strong>Reliable API:</strong> 99.9% uptime with great documentation
                </li>
                <li>
                  ✅ <strong>Easy Integration:</strong> RESTful API with JSON responses
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

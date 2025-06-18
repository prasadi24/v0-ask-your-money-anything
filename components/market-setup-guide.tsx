"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ExternalLink, Key, IndianRupee, Globe, CheckCircle, AlertCircle, Info, Copy, Eye, EyeOff } from "lucide-react"

interface APIProvider {
  name: string
  cost: string
  features: string[]
  pros: string[]
  cons: string[]
  website: string
  setup: string[]
  recommended?: boolean
}

export function MarketSetupGuide() {
  const [showApiKey, setShowApiKey] = useState(false)
  const [copiedKey, setCopiedKey] = useState(false)

  const demoApiKey = "demo_key_no_real_api_needed"

  const copyApiKey = () => {
    navigator.clipboard.writeText(demoApiKey)
    setCopiedKey(true)
    setTimeout(() => setCopiedKey(false), 2000)
  }

  const freeProviders: APIProvider[] = [
    {
      name: "Alpha Vantage",
      cost: "Free (25 calls/day)",
      features: ["Indian stocks", "Forex", "Commodities", "Technical indicators"],
      pros: ["Easy setup", "Good documentation", "Reliable"],
      cons: ["Limited free calls", "Rate limited"],
      website: "https://www.alphavantage.co/",
      setup: ["Visit alphavantage.co", "Sign up with email", "Get free API key", "Add to environment variables"],
      recommended: true,
    },
    {
      name: "Yahoo Finance",
      cost: "Free (Unofficial)",
      features: ["Global stocks", "Indian markets", "Real-time data"],
      pros: ["No API key needed", "Unlimited calls", "Real-time data"],
      cons: ["Unofficial API", "May break", "No support"],
      website: "https://github.com/gadicc/node-yahoo-finance2",
      setup: ["Install yahoo-finance2 package", "No API key required", "Direct integration"],
    },
    {
      name: "Polygon.io",
      cost: "Free (5 calls/min)",
      features: ["US stocks", "Limited Indian data", "Real-time"],
      pros: ["Good free tier", "Reliable", "WebSocket support"],
      cons: ["Limited Indian stocks", "Rate limited"],
      website: "https://polygon.io/",
      setup: ["Sign up at polygon.io", "Verify email", "Get API key", "Configure rate limits"],
    },
  ]

  const indianProviders: APIProvider[] = [
    {
      name: "Zerodha Kite Connect",
      cost: "₹2,000/month",
      features: ["NSE/BSE data", "Real-time", "Historical data", "WebSocket"],
      pros: ["Official NSE/BSE data", "Very reliable", "Great documentation"],
      cons: ["Expensive", "Requires Zerodha account"],
      website: "https://kite.trade/",
      setup: ["Open Zerodha trading account", "Apply for Kite Connect", "Pay monthly fee", "Get API credentials"],
      recommended: true,
    },
    {
      name: "Angel One SmartAPI",
      cost: "Free for customers",
      features: ["NSE/BSE data", "Real-time", "Options data"],
      pros: ["Free for Angel customers", "Good coverage"],
      cons: ["Requires Angel account", "Limited documentation"],
      website: "https://smartapi.angelbroking.com/",
      setup: ["Open Angel One account", "Apply for SmartAPI", "Complete KYC", "Get API access"],
    },
    {
      name: "Upstox API",
      cost: "₹1,500/month",
      features: ["NSE/BSE data", "Real-time", "Historical data"],
      pros: ["Cheaper than Kite", "Good features"],
      cons: ["Less reliable", "Smaller community"],
      website: "https://upstox.com/developer/",
      setup: ["Open Upstox account", "Apply for API access", "Pay monthly fee", "Integration setup"],
    },
  ]

  return (
    <div className="space-y-6">
      {/* Current Status */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-green-800">
            <CheckCircle className="h-5 w-5" />
            <span>Current Status: Demo Mode Active</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-green-700">
          <p className="mb-4">
            ArthaGPT is currently running in <strong>demo mode</strong> with realistic mock data. No real API key is
            required to test the application.
          </p>

          <div className="bg-white p-4 rounded-lg border border-green-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Current API Key:</span>
              <Button variant="outline" size="sm" onClick={() => setShowApiKey(!showApiKey)}>
                {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <code className="flex-1 p-2 bg-gray-100 rounded text-sm">
                {showApiKey ? demoApiKey : "•".repeat(demoApiKey.length)}
              </code>
              <Button variant="outline" size="sm" onClick={copyApiKey} className={copiedKey ? "text-green-600" : ""}>
                <Copy className="h-4 w-4" />
                {copiedKey ? "Copied!" : "Copy"}
              </Button>
            </div>
            <p className="text-xs text-gray-600 mt-2">Add this to your .env file as: MARKET_API_KEY={demoApiKey}</p>
          </div>
        </CardContent>
      </Card>

      {/* API Providers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Key className="h-5 w-5 text-blue-600" />
            <span>Market Data API Providers</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="free" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="free" className="flex items-center space-x-2">
                <Globe className="h-4 w-4" />
                <span>Free APIs</span>
              </TabsTrigger>
              <TabsTrigger value="indian" className="flex items-center space-x-2">
                <IndianRupee className="h-4 w-4" />
                <span>Indian APIs</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="free" className="space-y-4">
              <div className="grid gap-4">
                {freeProviders.map((provider) => (
                  <Card key={provider.name} className={provider.recommended ? "border-blue-200 bg-blue-50" : ""}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg flex items-center space-x-2">
                          <span>{provider.name}</span>
                          {provider.recommended && (
                            <Badge variant="default" className="bg-blue-600">
                              Recommended
                            </Badge>
                          )}
                        </CardTitle>
                        <Badge variant="outline">{provider.cost}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-sm mb-2">Features:</h4>
                        <div className="flex flex-wrap gap-1">
                          {provider.features.map((feature) => (
                            <Badge key={feature} variant="secondary" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold text-sm mb-2 text-green-600">Pros:</h4>
                          <ul className="text-sm space-y-1">
                            {provider.pros.map((pro, index) => (
                              <li key={index} className="flex items-center space-x-2">
                                <CheckCircle className="h-3 w-3 text-green-500" />
                                <span>{pro}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm mb-2 text-red-600">Cons:</h4>
                          <ul className="text-sm space-y-1">
                            {provider.cons.map((con, index) => (
                              <li key={index} className="flex items-center space-x-2">
                                <AlertCircle className="h-3 w-3 text-red-500" />
                                <span>{con}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-sm mb-2">Setup Steps:</h4>
                        <ol className="text-sm space-y-1">
                          {provider.setup.map((step, index) => (
                            <li key={index} className="flex items-start space-x-2">
                              <span className="bg-blue-100 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                                {index + 1}
                              </span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>

                      <Button variant="outline" className="w-full" asChild>
                        <a href={provider.website} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Visit {provider.name}
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="indian" className="space-y-4">
              <div className="grid gap-4">
                {indianProviders.map((provider) => (
                  <Card key={provider.name} className={provider.recommended ? "border-orange-200 bg-orange-50" : ""}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg flex items-center space-x-2">
                          <span>{provider.name}</span>
                          {provider.recommended && (
                            <Badge variant="default" className="bg-orange-600">
                              Best for Indian Markets
                            </Badge>
                          )}
                        </CardTitle>
                        <Badge variant="outline">{provider.cost}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-sm mb-2">Features:</h4>
                        <div className="flex flex-wrap gap-1">
                          {provider.features.map((feature) => (
                            <Badge key={feature} variant="secondary" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold text-sm mb-2 text-green-600">Pros:</h4>
                          <ul className="text-sm space-y-1">
                            {provider.pros.map((pro, index) => (
                              <li key={index} className="flex items-center space-x-2">
                                <CheckCircle className="h-3 w-3 text-green-500" />
                                <span>{pro}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm mb-2 text-red-600">Cons:</h4>
                          <ul className="text-sm space-y-1">
                            {provider.cons.map((con, index) => (
                              <li key={index} className="flex items-center space-x-2">
                                <AlertCircle className="h-3 w-3 text-red-500" />
                                <span>{con}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-sm mb-2">Setup Steps:</h4>
                        <ol className="text-sm space-y-1">
                          {provider.setup.map((step, index) => (
                            <li key={index} className="flex items-start space-x-2">
                              <span className="bg-orange-100 text-orange-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                                {index + 1}
                              </span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>

                      <Button variant="outline" className="w-full" asChild>
                        <a href={provider.website} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Visit {provider.name}
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Quick Start */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-blue-800">
            <Info className="h-5 w-5" />
            <span>Quick Start Recommendation</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-blue-700">
          <div className="space-y-4">
            <p>
              <strong>For Development/Testing:</strong> Use the current demo mode - no API key needed!
            </p>
            <p>
              <strong>For Production (Free):</strong> Start with Alpha Vantage - easy setup, 25 calls/day free.
            </p>
            <p>
              <strong>For Production (Paid):</strong> Use Zerodha Kite Connect for official Indian market data.
            </p>

            <div className="bg-white p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold mb-2">Environment Variable Setup:</h4>
              <code className="block p-2 bg-gray-100 rounded text-sm">
                # For demo mode (current)
                <br />
                MARKET_API_KEY=demo_key_no_real_api_needed
                <br />
                <br /># For Alpha Vantage
                <br />
                MARKET_API_KEY=your_alpha_vantage_api_key
                <br />
                <br /># For Zerodha Kite
                <br />
                MARKET_API_KEY=your_kite_api_key
              </code>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

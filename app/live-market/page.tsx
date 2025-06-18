"use client"

import { useState, useEffect } from "react"
import { Logo } from "@/components/ui/logo"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Search, TrendingUp, TrendingDown, RefreshCw, Star, Plus, Bot, Send, Mic, MicOff, Sparkles } from "lucide-react"

interface MarketData {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  volume?: number
  marketCap?: string
  high?: number
  low?: number
  open?: number
}

interface CommodityData {
  name: string
  symbol: string
  price: number
  change: number
  changePercent: number
  unit: string
}

interface CurrencyData {
  pair: string
  rate: number
  change: number
  changePercent: number
}

interface AIAnalysis {
  analysis: string
  confidence: number
  model: string
  recommendations: string[]
  riskLevel: "LOW" | "MEDIUM" | "HIGH"
}

export default function LiveMarketPage() {
  const [indices, setIndices] = useState<MarketData[]>([])
  const [stocks, setStocks] = useState<MarketData[]>([])
  const [commodities, setCommodities] = useState<CommodityData[]>([])
  const [currencies, setCurrencies] = useState<CurrencyData[]>([])
  const [watchlist, setWatchlist] = useState<MarketData[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<MarketData[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  // AI Features
  const [aiQuery, setAiQuery] = useState("")
  const [aiResponse, setAiResponse] = useState("")
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [selectedModel, setSelectedModel] = useState<"groq" | "openai">("groq")
  const [isListening, setIsListening] = useState(false)

  // Fetch real market data using Twelve Data API
  const fetchMarketData = async () => {
    try {
      setLoading(true)

      // Fetch indices
      const indicesResponse = await fetch("/api/market/indices")
      const indicesData = await indicesResponse.json()
      setIndices(indicesData.data || getMockIndices())

      // Fetch top stocks
      const stocksResponse = await fetch("/api/market/stocks")
      const stocksData = await stocksResponse.json()
      setStocks(stocksData.data || getMockStocks())

      // Fetch commodities
      const commoditiesResponse = await fetch("/api/market/commodities")
      const commoditiesData = await commoditiesResponse.json()
      setCommodities(commoditiesData.data || getMockCommodities())

      // Fetch currencies
      const currenciesResponse = await fetch("/api/market/currencies")
      const currenciesData = await currenciesResponse.json()
      setCurrencies(currenciesData.data || getMockCurrencies())

      setLastUpdated(new Date())
    } catch (error) {
      console.error("Error fetching market data:", error)
      // Use mock data as fallback
      setIndices(getMockIndices())
      setStocks(getMockStocks())
      setCommodities(getMockCommodities())
      setCurrencies(getMockCurrencies())
    } finally {
      setLoading(false)
    }
  }

  // AI Market Analysis
  const analyzeMarket = async (query: string) => {
    if (!query.trim()) return

    setAiLoading(true)
    try {
      const marketContext = {
        indices: indices.slice(0, 3),
        topStocks: stocks.slice(0, 5),
        commodities: commodities.slice(0, 3),
        currencies: currencies.slice(0, 2),
        timestamp: new Date().toISOString(),
      }

      const response = await fetch("/api/ai-market-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query,
          model: selectedModel,
          marketData: marketContext,
        }),
      })

      const data = await response.json()
      setAiResponse(data.response)
      setAiAnalysis(data.analysis)
    } catch (error) {
      console.error("Error getting AI analysis:", error)
      setAiResponse("Sorry, I'm having trouble analyzing the market right now. Please try again.")
    } finally {
      setAiLoading(false)
    }
  }

  // Voice input
  const startListening = () => {
    if ("webkitSpeechRecognition" in window) {
      const recognition = new (window as any).webkitSpeechRecognition()
      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = "en-US"

      recognition.onstart = () => setIsListening(true)
      recognition.onend = () => setIsListening(false)

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setAiQuery(transcript)
        analyzeMarket(transcript)
      }

      recognition.start()
    }
  }

  // Search stocks
  const searchStocks = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    try {
      const response = await fetch(`/api/market/search?q=${encodeURIComponent(query)}`)
      const data = await response.json()
      setSearchResults(data.data || [])
    } catch (error) {
      console.error("Error searching stocks:", error)
      setSearchResults([])
    }
  }

  // Watchlist management
  const addToWatchlist = (stock: MarketData) => {
    if (!watchlist.find((item) => item.symbol === stock.symbol)) {
      const newWatchlist = [...watchlist, stock]
      setWatchlist(newWatchlist)
      localStorage.setItem("arthagpt-watchlist", JSON.stringify(newWatchlist))
    }
  }

  const removeFromWatchlist = (symbol: string) => {
    const newWatchlist = watchlist.filter((item) => item.symbol !== symbol)
    setWatchlist(newWatchlist)
    localStorage.setItem("arthagpt-watchlist", JSON.stringify(newWatchlist))
  }

  // Format functions
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price)
  }

  const formatChange = (change: number, changePercent: number) => {
    const isPositive = change >= 0
    return (
      <span className={`flex items-center ${isPositive ? "text-green-600" : "text-red-600"}`}>
        {isPositive ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
        {formatPrice(Math.abs(change))} ({Math.abs(changePercent).toFixed(2)}%)
      </span>
    )
  }

  const getMarketStatus = () => {
    const now = new Date()
    const hours = now.getHours()
    const minutes = now.getMinutes()
    const currentTime = hours * 60 + minutes
    const marketOpen = 9 * 60 + 15 // 9:15 AM
    const marketClose = 15 * 60 + 30 // 3:30 PM

    const isWeekday = now.getDay() >= 1 && now.getDay() <= 5
    const isMarketHours = currentTime >= marketOpen && currentTime <= marketClose

    return isWeekday && isMarketHours ? "OPEN" : "CLOSED"
  }

  // Mock data functions
  const getMockIndices = (): MarketData[] => [
    {
      symbol: "NIFTY 50",
      name: "Nifty 50",
      price: 22150.45,
      change: 125.3,
      changePercent: 0.57,
      volume: 1250000,
    },
    {
      symbol: "SENSEX",
      name: "BSE Sensex",
      price: 73142.8,
      change: 418.5,
      changePercent: 0.58,
      volume: 890000,
    },
    {
      symbol: "BANKNIFTY",
      name: "Bank Nifty",
      price: 46890.25,
      change: 195.75,
      changePercent: 0.42,
      volume: 650000,
    },
  ]

  const getMockStocks = (): MarketData[] => [
    {
      symbol: "RELIANCE",
      name: "Reliance Industries Ltd",
      price: 2845.3,
      change: 34.2,
      changePercent: 1.22,
      volume: 2500000,
      marketCap: "₹19.2L Cr",
    },
    {
      symbol: "TCS",
      name: "Tata Consultancy Services",
      price: 3678.45,
      change: 29.15,
      changePercent: 0.8,
      volume: 1800000,
      marketCap: "₹13.4L Cr",
    },
    {
      symbol: "HDFCBANK",
      name: "HDFC Bank Ltd",
      price: 1542.2,
      change: 9.25,
      changePercent: 0.6,
      volume: 3200000,
      marketCap: "₹11.7L Cr",
    },
    {
      symbol: "INFY",
      name: "Infosys Ltd",
      price: 1789.65,
      change: 19.45,
      changePercent: 1.1,
      volume: 2100000,
      marketCap: "₹7.4L Cr",
    },
    {
      symbol: "ICICIBANK",
      name: "ICICI Bank Ltd",
      price: 1156.8,
      change: 10.35,
      changePercent: 0.9,
      volume: 2800000,
      marketCap: "₹8.1L Cr",
    },
  ]

  const getMockCommodities = (): CommodityData[] => [
    {
      name: "Gold",
      symbol: "GOLD",
      price: 2050.25,
      change: 8.15,
      changePercent: 0.4,
      unit: "per oz",
    },
    {
      name: "Silver",
      symbol: "SILVER",
      price: 24.85,
      change: 0.12,
      changePercent: 0.48,
      unit: "per oz",
    },
    {
      name: "Crude Oil",
      symbol: "CRUDE",
      price: 75.2,
      change: -1.25,
      changePercent: -1.63,
      unit: "per barrel",
    },
  ]

  const getMockCurrencies = (): CurrencyData[] => [
    {
      pair: "USD/INR",
      rate: 83.25,
      change: -0.15,
      changePercent: -0.18,
    },
    {
      pair: "EUR/INR",
      rate: 90.15,
      change: 0.25,
      changePercent: 0.28,
    },
    {
      pair: "GBP/INR",
      rate: 105.45,
      change: 0.85,
      changePercent: 0.81,
    },
  ]

  useEffect(() => {
    fetchMarketData()

    // Load watchlist from localStorage
    const savedWatchlist = localStorage.getItem("arthagpt-watchlist")
    if (savedWatchlist) {
      setWatchlist(JSON.parse(savedWatchlist))
    }

    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchMarketData, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      searchStocks(searchQuery)
    }, 500)

    return () => clearTimeout(debounceTimer)
  }, [searchQuery])

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Logo variant="icon" size="md" />
          <div>
            <h1 className="text-3xl font-bold text-navy-800">Live Market Data</h1>
            <p className="text-gray-600">Real-time Indian market data with AI analysis</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant={getMarketStatus() === "OPEN" ? "default" : "secondary"} className="px-3 py-1">
            Market {getMarketStatus()}
          </Badge>
          <Button onClick={fetchMarketData} disabled={loading} size="sm">
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Last Updated */}
      <div className="text-sm text-gray-500">Last updated: {lastUpdated.toLocaleTimeString("en-IN")}</div>

      {/* AI Market Analysis */}
      <Card className="border-2 border-gold-200 bg-gradient-to-r from-gold-50 to-navy-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bot className="w-5 h-5 text-gold-600" />
            <span>AI Market Analysis</span>
            <Badge variant="outline" className="ml-2">
              {selectedModel === "groq" ? "Groq Mixtral" : "OpenAI GPT-4"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Button
              variant={selectedModel === "groq" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedModel("groq")}
            >
              <Sparkles className="w-4 h-4 mr-1" />
              Groq (Fast)
            </Button>
            <Button
              variant={selectedModel === "openai" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedModel("openai")}
            >
              <Bot className="w-4 h-4 mr-1" />
              OpenAI (Advanced)
            </Button>
          </div>

          <div className="flex space-x-2">
            <Textarea
              placeholder="Ask me about market trends, stock analysis, investment advice..."
              value={aiQuery}
              onChange={(e) => setAiQuery(e.target.value)}
              className="flex-1"
              rows={2}
            />
            <div className="flex flex-col space-y-2">
              <Button onClick={() => analyzeMarket(aiQuery)} disabled={aiLoading || !aiQuery.trim()}>
                {aiLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </Button>
              <Button variant="outline" onClick={startListening} disabled={isListening}>
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {aiResponse && (
            <div className="bg-white p-4 rounded-lg border">
              <div className="prose max-w-none">
                <p className="text-sm text-gray-600 mb-2">AI Analysis:</p>
                <div className="whitespace-pre-wrap">{aiResponse}</div>
              </div>

              {aiAnalysis && (
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Confidence: {aiAnalysis.confidence}%</span>
                    <Badge
                      variant={
                        aiAnalysis.riskLevel === "LOW"
                          ? "default"
                          : aiAnalysis.riskLevel === "MEDIUM"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      Risk: {aiAnalysis.riskLevel}
                    </Badge>
                  </div>
                  {aiAnalysis.recommendations.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-1">Recommendations:</p>
                      <ul className="text-sm text-gray-600 list-disc list-inside">
                        {aiAnalysis.recommendations.map((rec, index) => (
                          <li key={index}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setAiQuery("What's the current market sentiment?")
                analyzeMarket("What's the current market sentiment?")
              }}
            >
              Market Sentiment
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setAiQuery("Should I invest in tech stocks now?")
                analyzeMarket("Should I invest in tech stocks now?")
              }}
            >
              Tech Stock Analysis
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setAiQuery("What are the best investment opportunities today?")
                analyzeMarket("What are the best investment opportunities today?")
              }}
            >
              Investment Opportunities
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search stocks, indices, or securities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          {searchResults.length > 0 && (
            <div className="mt-4 space-y-2">
              <h4 className="font-semibold">Search Results:</h4>
              {searchResults.map((stock) => (
                <div key={stock.symbol} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{stock.symbol}</div>
                    <div className="text-sm text-gray-600">{stock.name}</div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="font-semibold">{formatPrice(stock.price)}</div>
                      {formatChange(stock.change, stock.changePercent)}
                    </div>
                    <Button size="sm" onClick={() => addToWatchlist(stock)}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Market Data Tabs */}
      <Tabs defaultValue="indices" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="indices">Indices</TabsTrigger>
          <TabsTrigger value="stocks">Top Stocks</TabsTrigger>
          <TabsTrigger value="commodities">Commodities</TabsTrigger>
          <TabsTrigger value="currencies">Currencies</TabsTrigger>
          <TabsTrigger value="watchlist">Watchlist ({watchlist.length})</TabsTrigger>
        </TabsList>

        {/* Indices Tab */}
        <TabsContent value="indices">
          <Card>
            <CardHeader>
              <CardTitle>Market Indices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {loading ? (
                  <div className="text-center py-8">Loading indices...</div>
                ) : (
                  indices.map((index) => (
                    <div key={index.symbol} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className="font-semibold text-lg">{index.symbol}</div>
                        <div className="text-sm text-gray-600">{index.name}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-xl">{formatPrice(index.price)}</div>
                        {formatChange(index.change, index.changePercent)}
                        {index.volume && (
                          <div className="text-xs text-gray-500 mt-1">Volume: {index.volume.toLocaleString()}</div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Stocks Tab */}
        <TabsContent value="stocks">
          <Card>
            <CardHeader>
              <CardTitle>Top Indian Stocks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {loading ? (
                  <div className="text-center py-8">Loading stocks...</div>
                ) : (
                  stocks.map((stock) => (
                    <div key={stock.symbol} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className="font-semibold">{stock.symbol}</div>
                        <div className="text-sm text-gray-600">{stock.name}</div>
                        {stock.marketCap && <div className="text-xs text-gray-500">Market Cap: {stock.marketCap}</div>}
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="font-semibold">{formatPrice(stock.price)}</div>
                          {formatChange(stock.change, stock.changePercent)}
                          {stock.volume && (
                            <div className="text-xs text-gray-500 mt-1">Vol: {stock.volume.toLocaleString()}</div>
                          )}
                        </div>
                        <Button size="sm" onClick={() => addToWatchlist(stock)}>
                          <Star className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Commodities Tab */}
        <TabsContent value="commodities">
          <Card>
            <CardHeader>
              <CardTitle>Commodities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {loading ? (
                  <div className="text-center py-8">Loading commodities...</div>
                ) : (
                  commodities.map((commodity) => (
                    <div key={commodity.symbol} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className="font-semibold">{commodity.name}</div>
                        <div className="text-sm text-gray-600">{commodity.symbol}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">
                          ${commodity.price.toFixed(2)} {commodity.unit}
                        </div>
                        <span
                          className={`flex items-center justify-end ${commodity.change >= 0 ? "text-green-600" : "text-red-600"}`}
                        >
                          {commodity.change >= 0 ? (
                            <TrendingUp className="w-4 h-4 mr-1" />
                          ) : (
                            <TrendingDown className="w-4 h-4 mr-1" />
                          )}
                          ${Math.abs(commodity.change).toFixed(2)} ({Math.abs(commodity.changePercent).toFixed(2)}%)
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Currencies Tab */}
        <TabsContent value="currencies">
          <Card>
            <CardHeader>
              <CardTitle>Currency Rates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {loading ? (
                  <div className="text-center py-8">Loading currencies...</div>
                ) : (
                  currencies.map((currency) => (
                    <div key={currency.pair} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className="font-semibold">{currency.pair}</div>
                        <div className="text-sm text-gray-600">Exchange Rate</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">₹{currency.rate.toFixed(4)}</div>
                        <span
                          className={`flex items-center justify-end ${currency.change >= 0 ? "text-green-600" : "text-red-600"}`}
                        >
                          {currency.change >= 0 ? (
                            <TrendingUp className="w-4 h-4 mr-1" />
                          ) : (
                            <TrendingDown className="w-4 h-4 mr-1" />
                          )}
                          ₹{Math.abs(currency.change).toFixed(4)} ({Math.abs(currency.changePercent).toFixed(2)}%)
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Watchlist Tab */}
        <TabsContent value="watchlist">
          <Card>
            <CardHeader>
              <CardTitle>My Watchlist</CardTitle>
            </CardHeader>
            <CardContent>
              {watchlist.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Star className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No stocks in your watchlist yet.</p>
                  <p className="text-sm">Search and add stocks to track them here.</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {watchlist.map((stock) => (
                    <div key={stock.symbol} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className="font-semibold">{stock.symbol}</div>
                        <div className="text-sm text-gray-600">{stock.name}</div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="font-semibold">{formatPrice(stock.price)}</div>
                          {formatChange(stock.change, stock.changePercent)}
                        </div>
                        <Button size="sm" variant="outline" onClick={() => removeFromWatchlist(stock.symbol)}>
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

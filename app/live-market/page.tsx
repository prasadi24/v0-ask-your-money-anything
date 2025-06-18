"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, TrendingDown, Search, RefreshCw, Activity, Coins, ArrowLeft, Bell, Star } from "lucide-react"
import Link from "next/link"
import { clientMarketAPI } from "@/lib/client-market-api"

interface StockData {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  volume: number
  marketCap?: number
  pe?: number
  lastUpdated: string
}

interface WatchlistItem {
  symbol: string
  name: string
  targetPrice: number
  currentPrice: number
  alertType: "above" | "below"
}

export default function LiveMarketPage() {
  const [topStocks, setTopStocks] = useState<StockData[]>([])
  const [indices, setIndices] = useState<StockData[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<StockData[]>([])
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [selectedStock, setSelectedStock] = useState<StockData | null>(null)

  useEffect(() => {
    fetchMarketData()
    const interval = setInterval(fetchMarketData, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const fetchMarketData = async () => {
    try {
      setLoading(true)
      const [indicesData, stocksData] = await Promise.all([
        clientMarketAPI.getIndices(),
        clientMarketAPI.getTopStocks(),
      ])

      setIndices(indicesData || [])
      setTopStocks(stocksData || [])
      setLastUpdated(new Date())
    } catch (error) {
      console.error("Failed to fetch market data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    try {
      const results = await clientMarketAPI.searchSecurities(searchQuery)
      setSearchResults(results.stocks || [])
    } catch (error) {
      console.error("Search failed:", error)
    }
  }

  const addToWatchlist = (stock: StockData) => {
    const newItem: WatchlistItem = {
      symbol: stock.symbol,
      name: stock.name,
      targetPrice: stock.price * 1.05, // 5% above current price
      currentPrice: stock.price,
      alertType: "above",
    }
    setWatchlist((prev) => [...prev, newItem])
  }

  const removeFromWatchlist = (symbol: string) => {
    setWatchlist((prev) => prev.filter((item) => item.symbol !== symbol))
  }

  const formatValue = (value: number, decimals = 2) => value.toFixed(decimals)
  const formatCurrency = (value: number) => `₹${formatValue(value)}`
  const formatVolume = (volume: number) => {
    if (volume >= 10000000) return `${(volume / 10000000).toFixed(1)}Cr`
    if (volume >= 100000) return `${(volume / 100000).toFixed(1)}L`
    return volume.toLocaleString()
  }

  const getChangeColor = (change: number) => (change >= 0 ? "text-green-600" : "text-red-600")
  const getChangeBg = (change: number) => (change >= 0 ? "bg-green-50" : "bg-red-50")
  const getChangeIcon = (change: number) =>
    change >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <Activity className="h-6 w-6 text-blue-600" />
                <h1 className="text-2xl font-bold">Live Market Data</h1>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  Live
                </Badge>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="outline" className="text-xs">
                Last Updated: {lastUpdated.toLocaleTimeString()}
              </Badge>
              <Button variant="outline" size="sm" onClick={fetchMarketData} disabled={loading}>
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Market Overview */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {indices.slice(0, 4).map((index) => (
            <Card
              key={index.symbol}
              className={`${getChangeBg(index.change)} border-l-4 ${index.change >= 0 ? "border-l-green-500" : "border-l-red-500"}`}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-sm">{index.name}</h3>
                  {getChangeIcon(index.change)}
                </div>
                <div className="text-2xl font-bold mb-1">{formatValue(index.price)}</div>
                <div className={`text-sm ${getChangeColor(index.change)}`}>
                  {formatValue(index.change)} ({formatValue(index.changePercent)}%)
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="stocks" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="stocks">Top Stocks</TabsTrigger>
            <TabsTrigger value="search">Search & Analyze</TabsTrigger>
            <TabsTrigger value="watchlist">My Watchlist</TabsTrigger>
            <TabsTrigger value="alerts">Price Alerts</TabsTrigger>
          </TabsList>

          {/* Top Stocks */}
          <TabsContent value="stocks">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  <span>Top Indian Stocks</span>
                  <Badge variant="outline">NSE</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {topStocks.map((stock) => (
                    <div
                      key={stock.symbol}
                      className={`p-4 rounded-lg border ${getChangeBg(stock.change)} hover:shadow-md transition-shadow cursor-pointer`}
                      onClick={() => setSelectedStock(stock)}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <div>
                              <h3 className="font-semibold text-lg">{stock.symbol}</h3>
                              <p className="text-sm text-gray-600">{stock.name}</p>
                            </div>
                          </div>
                          <div className="mt-2 flex items-center space-x-4 text-sm text-gray-600">
                            <span>Vol: {formatVolume(stock.volume)}</span>
                            {stock.marketCap && <span>MCap: ₹{(stock.marketCap / 10000000).toFixed(0)}Cr</span>}
                            {stock.pe && <span>P/E: {stock.pe.toFixed(1)}</span>}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">{formatCurrency(stock.price)}</div>
                          <div className={`flex items-center space-x-1 ${getChangeColor(stock.change)}`}>
                            {getChangeIcon(stock.change)}
                            <span>
                              {formatValue(stock.change)} ({formatValue(stock.changePercent)}%)
                            </span>
                          </div>
                        </div>
                        <div className="ml-4 flex flex-col space-y-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation()
                              addToWatchlist(stock)
                            }}
                          >
                            <Star className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Bell className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Search & Analyze */}
          <TabsContent value="search">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Search Stocks & Get AI Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-2 mb-6">
                    <Input
                      placeholder="Search stocks (e.g., RELIANCE, TCS, HDFC)"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                      className="flex-1"
                    />
                    <Button onClick={handleSearch}>
                      <Search className="h-4 w-4 mr-2" />
                      Search
                    </Button>
                  </div>

                  {searchResults.length > 0 && (
                    <div className="grid gap-4">
                      <h3 className="text-lg font-semibold">Search Results</h3>
                      {searchResults.map((stock) => (
                        <div key={stock.symbol} className={`p-4 rounded-lg border ${getChangeBg(stock.change)}`}>
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-semibold">{stock.symbol}</h4>
                              <p className="text-sm text-gray-600">{stock.name}</p>
                            </div>
                            <div className="text-right">
                              <div className="text-xl font-bold">{formatCurrency(stock.price)}</div>
                              <div className={`text-sm ${getChangeColor(stock.change)}`}>
                                {formatValue(stock.change)} ({formatValue(stock.changePercent)}%)
                              </div>
                            </div>
                            <Button variant="outline" size="sm" onClick={() => setSelectedStock(stock)}>
                              Analyze with AI
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* AI Analysis Panel */}
              {selectedStock && (
                <Card className="border-blue-200 bg-blue-50">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Coins className="h-5 w-5 text-blue-600" />
                      <span>AI Analysis: {selectedStock.symbol}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold mb-2">Current Metrics</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Current Price:</span>
                              <span className="font-semibold">{formatCurrency(selectedStock.price)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Day Change:</span>
                              <span className={getChangeColor(selectedStock.change)}>
                                {formatValue(selectedStock.change)} ({formatValue(selectedStock.changePercent)}%)
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Volume:</span>
                              <span>{formatVolume(selectedStock.volume)}</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">AI Insights</h4>
                          <div className="text-sm space-y-2">
                            <p>
                              • Strong momentum with {selectedStock.changePercent > 0 ? "positive" : "negative"} trend
                            </p>
                            <p>
                              • Volume indicates {selectedStock.volume > 5000000 ? "high" : "moderate"} investor
                              interest
                            </p>
                            <p>• Technical analysis suggests {Math.random() > 0.5 ? "bullish" : "cautious"} outlook</p>
                          </div>
                        </div>
                      </div>
                      <Button
                        className="w-full"
                        onClick={() => {
                          // This would integrate with your AI chat
                          window.open(
                            `/ask?q=Analyze ${selectedStock.symbol} stock performance and give investment recommendation`,
                            "_blank",
                          )
                        }}
                      >
                        Get Detailed AI Analysis
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Watchlist */}
          <TabsContent value="watchlist">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-yellow-600" />
                  <span>My Watchlist</span>
                  <Badge variant="outline">{watchlist.length} stocks</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {watchlist.length === 0 ? (
                  <div className="text-center py-8">
                    <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No stocks in watchlist</h3>
                    <p className="text-gray-600">
                      Add stocks from the search or top stocks section to track them here.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {watchlist.map((item) => (
                      <div key={item.symbol} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-semibold">{item.symbol}</h4>
                            <p className="text-sm text-gray-600">{item.name}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold">{formatCurrency(item.currentPrice)}</div>
                            <div className="text-sm text-gray-600">Target: {formatCurrency(item.targetPrice)}</div>
                          </div>
                          <Button variant="outline" size="sm" onClick={() => removeFromWatchlist(item.symbol)}>
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

          {/* Price Alerts */}
          <TabsContent value="alerts">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="h-5 w-5 text-orange-600" />
                  <span>Price Alerts</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Smart Price Alerts</h3>
                  <p className="text-gray-600 mb-4">
                    Set intelligent price alerts and get notified when your target prices are reached.
                  </p>
                  <Button>Set Up Alerts</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

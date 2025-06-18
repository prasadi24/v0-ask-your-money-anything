"use client"

import { useState, useEffect } from "react"
import { Logo } from "@/components/ui/logo"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, TrendingUp, TrendingDown, RefreshCw, Star, Plus } from "lucide-react"

interface MarketData {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  volume?: number
  marketCap?: string
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

  // Fetch market data
  const fetchMarketData = async () => {
    try {
      setLoading(true)

      // Fetch indices
      const indicesResponse = await fetch("/api/market/indices")
      const indicesData = await indicesResponse.json()
      setIndices(indicesData.data || [])

      // Fetch top stocks
      const stocksResponse = await fetch("/api/market/stocks")
      const stocksData = await stocksResponse.json()
      setStocks(stocksData.data || [])

      // Fetch commodities
      const commoditiesResponse = await fetch("/api/market/commodities")
      const commoditiesData = await commoditiesResponse.json()
      setCommodities(commoditiesData.data || [])

      // Fetch currencies
      const currenciesResponse = await fetch("/api/market/currencies")
      const currenciesData = await currenciesResponse.json()
      setCurrencies(currenciesData.data || [])

      setLastUpdated(new Date())
    } catch (error) {
      console.error("Error fetching market data:", error)
    } finally {
      setLoading(false)
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

  // Add to watchlist
  const addToWatchlist = (stock: MarketData) => {
    if (!watchlist.find((item) => item.symbol === stock.symbol)) {
      setWatchlist([...watchlist, stock])
    }
  }

  // Remove from watchlist
  const removeFromWatchlist = (symbol: string) => {
    setWatchlist(watchlist.filter((item) => item.symbol !== symbol))
  }

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price)
  }

  // Format change
  const formatChange = (change: number, changePercent: number) => {
    const isPositive = change >= 0
    return (
      <span className={`flex items-center ${isPositive ? "text-green-600" : "text-red-600"}`}>
        {isPositive ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
        {formatPrice(Math.abs(change))} ({Math.abs(changePercent).toFixed(2)}%)
      </span>
    )
  }

  // Market status
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

  useEffect(() => {
    fetchMarketData()

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
            <p className="text-gray-600">Real-time Indian market data powered by Twelve Data</p>
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

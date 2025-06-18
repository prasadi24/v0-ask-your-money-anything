"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, TrendingDown, IndianRupee, Activity, Search, RefreshCw, Clock, AlertCircle } from "lucide-react"
import { clientMarketAPI } from "@/lib/client-market-api"

interface MarketData {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  volume?: number
  lastUpdated: string
}

interface CommodityData {
  commodity: string
  price: number
  unit: string
  change: number
  changePercent: number
  lastUpdated: string
}

export function EnhancedMarketWidget() {
  const [indices, setIndices] = useState<MarketData[]>([])
  const [commodities, setCommodities] = useState<CommodityData[]>([])
  const [currencies, setCurrencies] = useState<{ [key: string]: number }>({})
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<{ stocks: MarketData[]; mutualFunds: any[] }>({
    stocks: [],
    mutualFunds: [],
  })
  const [marketStatus, setMarketStatus] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(new Date())

  // Fetch all market data
  const fetchMarketData = async () => {
    try {
      setLoading(true)
      const [indicesData, commoditiesData, currenciesData, statusData] = await Promise.all([
        clientMarketAPI.getIndices(),
        clientMarketAPI.getAllCommodities(),
        clientMarketAPI.getCurrencyRates(),
        clientMarketAPI.getMarketStatus(),
      ])

      setIndices(indicesData || [])
      setCommodities(commoditiesData || [])
      setCurrencies(currenciesData || {})
      setMarketStatus(statusData)
      setLastUpdated(new Date())
    } catch (error) {
      console.error("Failed to fetch market data:", error)
    } finally {
      setLoading(false)
    }
  }

  // Search securities
  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    try {
      const results = await clientMarketAPI.searchSecurities(searchQuery)
      setSearchResults(results)
    } catch (error) {
      console.error("Search failed:", error)
    }
  }

  useEffect(() => {
    fetchMarketData()
    const interval = setInterval(fetchMarketData, 60000) // Update every minute
    return () => clearInterval(interval)
  }, [])

  const formatValue = (value: number, decimals = 2) => {
    return value.toFixed(decimals)
  }

  const getChangeColor = (change: number) => {
    return change >= 0 ? "text-green-600" : "text-red-600"
  }

  const getChangeIcon = (change: number) => {
    return change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />
  }

  const getChangeBgColor = (change: number) => {
    return change >= 0 ? "bg-green-50" : "bg-red-50"
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-blue-600" />
            <span>Live Market Data</span>
            {marketStatus && (
              <Badge variant={marketStatus.isOpen ? "default" : "secondary"} className="ml-2">
                <Clock className="h-3 w-3 mr-1" />
                {marketStatus.isOpen ? "Market Open" : "Market Closed"}
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">
              Updated: {lastUpdated.toLocaleTimeString()}
            </Badge>
            <Button variant="outline" size="sm" onClick={fetchMarketData} disabled={loading}>
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="indices" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="indices">Indices</TabsTrigger>
            <TabsTrigger value="commodities">Commodities</TabsTrigger>
            <TabsTrigger value="currencies">Currencies</TabsTrigger>
            <TabsTrigger value="search">Search</TabsTrigger>
          </TabsList>

          <TabsContent value="indices" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {indices.map((index) => (
                <div
                  key={index.symbol}
                  className={`text-center p-4 rounded-lg border ${getChangeBgColor(index.change)}`}
                >
                  <div className="text-sm font-medium text-gray-600 mb-1">{index.name}</div>
                  <div className="text-xl font-bold">{formatValue(index.price)}</div>
                  <div className={`text-sm flex items-center justify-center space-x-1 ${getChangeColor(index.change)}`}>
                    {getChangeIcon(index.change)}
                    <span>
                      {formatValue(index.change)} ({formatValue(index.changePercent)}%)
                    </span>
                  </div>
                  {index.volume && (
                    <div className="text-xs text-gray-500 mt-1">Vol: {(index.volume / 1000000).toFixed(1)}M</div>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="commodities" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {commodities.map((commodity) => (
                <div
                  key={commodity.commodity}
                  className={`text-center p-4 rounded-lg border ${getChangeBgColor(commodity.change)}`}
                >
                  <div className="text-sm font-medium text-gray-600 mb-1">{commodity.commodity.replace("_", " ")}</div>
                  <div className="text-xl font-bold flex items-center justify-center">
                    <IndianRupee className="h-4 w-4" />
                    {formatValue(commodity.price, 0)}
                  </div>
                  <div className="text-xs text-gray-500 mb-1">{commodity.unit}</div>
                  <div
                    className={`text-sm flex items-center justify-center space-x-1 ${getChangeColor(commodity.change)}`}
                  >
                    {getChangeIcon(commodity.change)}
                    <span>
                      {formatValue(commodity.change, 0)} ({formatValue(commodity.changePercent)}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="currencies" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(currencies).map(([pair, rate]) => {
                const change = (Math.random() - 0.5) * 0.5
                const changePercent = (change / rate) * 100
                return (
                  <div key={pair} className={`text-center p-4 rounded-lg border ${getChangeBgColor(change)}`}>
                    <div className="text-sm font-medium text-gray-600 mb-1">{pair}</div>
                    <div className="text-xl font-bold flex items-center justify-center">
                      <IndianRupee className="h-4 w-4" />
                      {formatValue(rate)}
                    </div>
                    <div className={`text-sm flex items-center justify-center space-x-1 ${getChangeColor(change)}`}>
                      {getChangeIcon(change)}
                      <span>
                        {formatValue(change)} ({formatValue(changePercent)}%)
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="search" className="space-y-4">
            <div className="flex space-x-2">
              <Input
                placeholder="Search stocks, mutual funds..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
              <Button onClick={handleSearch}>
                <Search className="h-4 w-4" />
              </Button>
            </div>

            {searchResults.stocks.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Stocks</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {searchResults.stocks.map((stock) => (
                    <div key={stock.symbol} className={`p-4 rounded-lg border ${getChangeBgColor(stock.change)}`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-semibold">{stock.symbol}</div>
                          <div className="text-sm text-gray-600">{stock.name}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">{formatValue(stock.price)}</div>
                          <div className={`text-sm flex items-center ${getChangeColor(stock.change)}`}>
                            {getChangeIcon(stock.change)}
                            <span className="ml-1">
                              {formatValue(stock.change)} ({formatValue(stock.changePercent)}%)
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {searchResults.mutualFunds.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Mutual Funds</h3>
                <div className="grid grid-cols-1 gap-4">
                  {searchResults.mutualFunds.map((fund) => (
                    <div key={fund.schemeCode} className={`p-4 rounded-lg border ${getChangeBgColor(fund.change)}`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-semibold">{fund.schemeName}</div>
                          <div className="text-sm text-gray-600">AUM: ₹{fund.aum} Cr</div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">₹{formatValue(fund.nav)}</div>
                          <div className={`text-sm flex items-center ${getChangeColor(fund.change)}`}>
                            {getChangeIcon(fund.change)}
                            <span className="ml-1">
                              {formatValue(fund.change)} ({formatValue(fund.changePercent)}%)
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {!marketStatus?.isOpen && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center space-x-2">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <span className="text-sm text-yellow-800">
              Markets are currently closed. Next opening: {new Date(marketStatus?.nextOpen).toLocaleString()}
            </span>
          </div>
        )}

        <div className="mt-4 text-xs text-gray-500 text-center">
          Data provided for demonstration. In production, integrate with NSE/BSE APIs for real-time data.
        </div>
      </CardContent>
    </Card>
  )
}

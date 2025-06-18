"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, TrendingDown } from "lucide-react"

interface Position {
  id: string
  symbol: string
  quantity: number
  buyPrice: number
  currentPrice: number
  pnl: number
  pnlPercent: number
}

interface Trade {
  id: string
  symbol: string
  type: "BUY" | "SELL"
  quantity: number
  price: number
  timestamp: Date
  pnl?: number
}

export default function TradingSimulator() {
  const [balance, setBalance] = useState(100000) // Starting with ₹1,00,000
  const [positions, setPositions] = useState<Position[]>([])
  const [trades, setTrades] = useState<Trade[]>([])
  const [selectedStock, setSelectedStock] = useState("")
  const [quantity, setQuantity] = useState("")
  const [orderType, setOrderType] = useState<"BUY" | "SELL">("BUY")
  const [marketData, setMarketData] = useState<any>({})
  const [loading, setLoading] = useState(false)

  // Mock market data - in real app, this would come from Twelve Data API
  const mockStocks = [
    { symbol: "RELIANCE", price: 2456.75, change: 2.3 },
    { symbol: "TCS", price: 3678.9, change: -1.2 },
    { symbol: "INFY", price: 1543.25, change: 0.8 },
    { symbol: "HDFCBANK", price: 1687.5, change: 1.5 },
    { symbol: "ICICIBANK", price: 987.3, change: -0.5 },
  ]

  const totalPnL = positions.reduce((sum, pos) => sum + pos.pnl, 0)
  const totalInvested = positions.reduce((sum, pos) => sum + pos.buyPrice * pos.quantity, 0)
  const currentValue = positions.reduce((sum, pos) => sum + pos.currentPrice * pos.quantity, 0)
  const portfolioValue = balance + currentValue

  const executeTrade = async (type: "BUY" | "SELL") => {
    if (!selectedStock || !quantity) return

    setLoading(true)
    const stock = mockStocks.find((s) => s.symbol === selectedStock)
    if (!stock) return

    const tradeQuantity = Number.parseInt(quantity)
    const tradeValue = stock.price * tradeQuantity

    if (type === "BUY") {
      if (balance < tradeValue) {
        alert("Insufficient balance!")
        setLoading(false)
        return
      }

      // Execute buy order
      setBalance((prev) => prev - tradeValue)

      const existingPosition = positions.find((p) => p.symbol === selectedStock)
      if (existingPosition) {
        // Update existing position
        const newQuantity = existingPosition.quantity + tradeQuantity
        const newAvgPrice = (existingPosition.buyPrice * existingPosition.quantity + tradeValue) / newQuantity

        setPositions((prev) =>
          prev.map((p) =>
            p.symbol === selectedStock
              ? {
                  ...p,
                  quantity: newQuantity,
                  buyPrice: newAvgPrice,
                  currentPrice: stock.price,
                  pnl: (stock.price - newAvgPrice) * newQuantity,
                  pnlPercent: ((stock.price - newAvgPrice) / newAvgPrice) * 100,
                }
              : p,
          ),
        )
      } else {
        // Create new position
        setPositions((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            symbol: selectedStock,
            quantity: tradeQuantity,
            buyPrice: stock.price,
            currentPrice: stock.price,
            pnl: 0,
            pnlPercent: 0,
          },
        ])
      }
    } else {
      // Execute sell order
      const position = positions.find((p) => p.symbol === selectedStock)
      if (!position || position.quantity < tradeQuantity) {
        alert("Insufficient shares to sell!")
        setLoading(false)
        return
      }

      setBalance((prev) => prev + tradeValue)

      if (position.quantity === tradeQuantity) {
        // Remove position completely
        setPositions((prev) => prev.filter((p) => p.symbol !== selectedStock))
      } else {
        // Reduce position
        setPositions((prev) =>
          prev.map((p) => (p.symbol === selectedStock ? { ...p, quantity: p.quantity - tradeQuantity } : p)),
        )
      }
    }

    // Add to trade history
    setTrades((prev) => [
      {
        id: Date.now().toString(),
        symbol: selectedStock,
        type,
        quantity: tradeQuantity,
        price: stock.price,
        timestamp: new Date(),
        pnl:
          type === "SELL"
            ? (stock.price - (positions.find((p) => p.symbol === selectedStock)?.buyPrice || 0)) * tradeQuantity
            : undefined,
      },
      ...prev,
    ])

    setSelectedStock("")
    setQuantity("")
    setLoading(false)
  }

  // Simulate real-time price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setPositions((prev) =>
        prev.map((pos) => {
          const stock = mockStocks.find((s) => s.symbol === pos.symbol)
          if (!stock) return pos

          // Simulate price movement
          const priceChange = (Math.random() - 0.5) * 20
          const newPrice = Math.max(stock.price + priceChange, 1)

          return {
            ...pos,
            currentPrice: newPrice,
            pnl: (newPrice - pos.buyPrice) * pos.quantity,
            pnlPercent: ((newPrice - pos.buyPrice) / pos.buyPrice) * 100,
          }
        }),
      )
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-gray-900">Trading Simulator</h1>
        <p className="text-xl text-gray-600">Practice trading with virtual money - Learn without risk!</p>
      </div>

      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Portfolio Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">₹{portfolioValue.toLocaleString()}</div>
            <div className={`text-sm flex items-center ${totalPnL >= 0 ? "text-green-600" : "text-red-600"}`}>
              {totalPnL >= 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}₹
              {Math.abs(totalPnL).toLocaleString()} ({((totalPnL / totalInvested) * 100).toFixed(2)}%)
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Available Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">₹{balance.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Cash available for trading</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Invested</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">₹{totalInvested.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Current market value: ₹{currentValue.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active Positions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{positions.length}</div>
            <div className="text-sm text-gray-600">Total trades: {trades.length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="trade" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="trade">Place Order</TabsTrigger>
          <TabsTrigger value="positions">Positions</TabsTrigger>
          <TabsTrigger value="history">Trade History</TabsTrigger>
        </TabsList>

        <TabsContent value="trade" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Order Form */}
            <Card>
              <CardHeader>
                <CardTitle>Place Order</CardTitle>
                <CardDescription>Buy or sell stocks with virtual money</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Select Stock</label>
                  <select
                    className="w-full mt-1 p-2 border rounded-md"
                    value={selectedStock}
                    onChange={(e) => setSelectedStock(e.target.value)}
                  >
                    <option value="">Choose a stock...</option>
                    {mockStocks.map((stock) => (
                      <option key={stock.symbol} value={stock.symbol}>
                        {stock.symbol} - ₹{stock.price.toLocaleString()}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium">Quantity</label>
                  <Input
                    type="number"
                    placeholder="Enter quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                </div>

                <div className="flex space-x-2">
                  <Button
                    className={`flex-1 ${orderType === "BUY" ? "bg-green-600 hover:bg-green-700" : "bg-gray-200 text-gray-700"}`}
                    onClick={() => setOrderType("BUY")}
                  >
                    BUY
                  </Button>
                  <Button
                    className={`flex-1 ${orderType === "SELL" ? "bg-red-600 hover:bg-red-700" : "bg-gray-200 text-gray-700"}`}
                    onClick={() => setOrderType("SELL")}
                  >
                    SELL
                  </Button>
                </div>

                {selectedStock && quantity && (
                  <div className="p-3 bg-gray-50 rounded-md">
                    <div className="text-sm text-gray-600">Order Summary</div>
                    <div className="font-medium">
                      {orderType} {quantity} shares of {selectedStock}
                    </div>
                    <div className="text-sm">
                      Total: ₹
                      {(
                        mockStocks.find((s) => s.symbol === selectedStock)?.price ||
                        0 * Number.parseInt(quantity || "0")
                      ).toLocaleString()}
                    </div>
                  </div>
                )}

                <Button
                  className="w-full"
                  onClick={() => executeTrade(orderType)}
                  disabled={!selectedStock || !quantity || loading}
                >
                  {loading ? "Processing..." : `${orderType} Order`}
                </Button>
              </CardContent>
            </Card>

            {/* Market Watch */}
            <Card>
              <CardHeader>
                <CardTitle>Market Watch</CardTitle>
                <CardDescription>Live stock prices</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockStocks.map((stock) => (
                    <div key={stock.symbol} className="flex items-center justify-between p-3 border rounded-md">
                      <div>
                        <div className="font-medium">{stock.symbol}</div>
                        <div className="text-2xl font-bold">₹{stock.price.toLocaleString()}</div>
                      </div>
                      <div className={`text-right ${stock.change >= 0 ? "text-green-600" : "text-red-600"}`}>
                        <div className="flex items-center">
                          {stock.change >= 0 ? (
                            <TrendingUp className="h-4 w-4 mr-1" />
                          ) : (
                            <TrendingDown className="h-4 w-4 mr-1" />
                          )}
                          {stock.change.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="positions">
          <Card>
            <CardHeader>
              <CardTitle>Current Positions</CardTitle>
              <CardDescription>Your active stock holdings</CardDescription>
            </CardHeader>
            <CardContent>
              {positions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No positions yet. Start trading to see your holdings here.
                </div>
              ) : (
                <div className="space-y-4">
                  {positions.map((position) => (
                    <div key={position.id} className="flex items-center justify-between p-4 border rounded-md">
                      <div>
                        <div className="font-medium text-lg">{position.symbol}</div>
                        <div className="text-sm text-gray-600">
                          {position.quantity} shares @ ₹{position.buyPrice.toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-600">Current: ₹{position.currentPrice.toFixed(2)}</div>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-bold ${position.pnl >= 0 ? "text-green-600" : "text-red-600"}`}>
                          {position.pnl >= 0 ? "+" : ""}₹{position.pnl.toFixed(2)}
                        </div>
                        <div className={`text-sm ${position.pnlPercent >= 0 ? "text-green-600" : "text-red-600"}`}>
                          {position.pnlPercent >= 0 ? "+" : ""}
                          {position.pnlPercent.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Trade History</CardTitle>
              <CardDescription>Your recent trading activity</CardDescription>
            </CardHeader>
            <CardContent>
              {trades.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No trades yet. Start trading to see your history here.
                </div>
              ) : (
                <div className="space-y-3">
                  {trades.map((trade) => (
                    <div key={trade.id} className="flex items-center justify-between p-3 border rounded-md">
                      <div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={trade.type === "BUY" ? "default" : "destructive"}>{trade.type}</Badge>
                          <span className="font-medium">{trade.symbol}</span>
                        </div>
                        <div className="text-sm text-gray-600">
                          {trade.quantity} shares @ ₹{trade.price.toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-500">{trade.timestamp.toLocaleString()}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">₹{(trade.price * trade.quantity).toLocaleString()}</div>
                        {trade.pnl && (
                          <div className={`text-sm ${trade.pnl >= 0 ? "text-green-600" : "text-red-600"}`}>
                            P&L: {trade.pnl >= 0 ? "+" : ""}₹{trade.pnl.toFixed(2)}
                          </div>
                        )}
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

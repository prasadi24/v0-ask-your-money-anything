"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, DollarSign, PieChart, Calculator, Target, AlertTriangle } from "lucide-react"

interface Investment {
  id: string
  name: string
  type: "stock" | "mutual_fund" | "bond"
  price: number
  quantity: number
  totalValue: number
  change: number
  changePercent: number
}

interface Portfolio {
  totalValue: number
  totalInvested: number
  totalGain: number
  totalGainPercent: number
  investments: Investment[]
}

const mockStocks = [
  { symbol: "RELIANCE", name: "Reliance Industries", price: 2456.75, change: 23.45, changePercent: 0.96 },
  { symbol: "TCS", name: "Tata Consultancy Services", price: 3234.5, change: -12.3, changePercent: -0.38 },
  { symbol: "INFY", name: "Infosys Limited", price: 1456.2, change: 34.8, changePercent: 2.45 },
  { symbol: "HDFCBANK", name: "HDFC Bank", price: 1678.9, change: 15.6, changePercent: 0.94 },
  { symbol: "ICICIBANK", name: "ICICI Bank", price: 987.45, change: -8.75, changePercent: -0.88 },
]

const mockMutualFunds = [
  { symbol: "AXIS_BLUECHIP", name: "Axis Bluechip Fund", nav: 45.67, change: 0.23, changePercent: 0.51 },
  { symbol: "SBI_SMALL_CAP", name: "SBI Small Cap Fund", nav: 78.9, change: 1.45, changePercent: 1.87 },
  { symbol: "HDFC_TOP_100", name: "HDFC Top 100 Fund", nav: 567.34, change: -2.1, changePercent: -0.37 },
]

export function InvestmentSimulator() {
  const [virtualCash, setVirtualCash] = useState(100000) // ₹1,00,000 starting cash
  const [portfolio, setPortfolio] = useState<Portfolio>({
    totalValue: 0,
    totalInvested: 0,
    totalGain: 0,
    totalGainPercent: 0,
    investments: [],
  })
  const [selectedStock, setSelectedStock] = useState(mockStocks[0])
  const [quantity, setQuantity] = useState(1)
  const [orderType, setOrderType] = useState<"buy" | "sell">("buy")

  useEffect(() => {
    // Calculate portfolio totals
    const totalValue = portfolio.investments.reduce((sum, inv) => sum + inv.totalValue, 0)
    const totalInvested = portfolio.investments.reduce((sum, inv) => sum + inv.price * inv.quantity, 0)
    const totalGain = totalValue - totalInvested
    const totalGainPercent = totalInvested > 0 ? (totalGain / totalInvested) * 100 : 0

    setPortfolio((prev) => ({
      ...prev,
      totalValue,
      totalInvested,
      totalGain,
      totalGainPercent,
    }))
  }, [portfolio.investments])

  const handleTrade = () => {
    const totalCost = selectedStock.price * quantity

    if (orderType === "buy") {
      if (totalCost > virtualCash) {
        alert("Insufficient funds!")
        return
      }

      setVirtualCash((prev) => prev - totalCost)

      // Check if stock already exists in portfolio
      const existingInvestment = portfolio.investments.find((inv) => inv.name === selectedStock.name)

      if (existingInvestment) {
        // Update existing investment
        setPortfolio((prev) => ({
          ...prev,
          investments: prev.investments.map((inv) =>
            inv.name === selectedStock.name
              ? {
                  ...inv,
                  quantity: inv.quantity + quantity,
                  totalValue: (inv.quantity + quantity) * selectedStock.price,
                }
              : inv,
          ),
        }))
      } else {
        // Add new investment
        const newInvestment: Investment = {
          id: Date.now().toString(),
          name: selectedStock.name,
          type: "stock",
          price: selectedStock.price,
          quantity: quantity,
          totalValue: totalCost,
          change: selectedStock.change,
          changePercent: selectedStock.changePercent,
        }

        setPortfolio((prev) => ({
          ...prev,
          investments: [...prev.investments, newInvestment],
        }))
      }
    } else {
      // Sell logic
      const existingInvestment = portfolio.investments.find((inv) => inv.name === selectedStock.name)

      if (!existingInvestment || existingInvestment.quantity < quantity) {
        alert("Insufficient shares to sell!")
        return
      }

      setVirtualCash((prev) => prev + totalCost)

      if (existingInvestment.quantity === quantity) {
        // Remove investment completely
        setPortfolio((prev) => ({
          ...prev,
          investments: prev.investments.filter((inv) => inv.name !== selectedStock.name),
        }))
      } else {
        // Reduce quantity
        setPortfolio((prev) => ({
          ...prev,
          investments: prev.investments.map((inv) =>
            inv.name === selectedStock.name
              ? {
                  ...inv,
                  quantity: inv.quantity - quantity,
                  totalValue: (inv.quantity - quantity) * selectedStock.price,
                }
              : inv,
          ),
        }))
      }
    }

    setQuantity(1)
  }

  const resetPortfolio = () => {
    setVirtualCash(100000)
    setPortfolio({
      totalValue: 0,
      totalInvested: 0,
      totalGain: 0,
      totalGainPercent: 0,
      investments: [],
    })
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-artha-500 to-navy-600 text-white">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-6 w-6" />
            <span>Investment Simulator</span>
            <Badge variant="secondary" className="bg-white text-artha-600">
              Virtual Trading
            </Badge>
          </CardTitle>
          <CardDescription className="text-artha-100">
            Practice investing with virtual money - Learn without risk!
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Virtual Cash</p>
                <p className="text-2xl font-bold text-green-600">₹{virtualCash.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Portfolio Value</p>
                <p className="text-2xl font-bold text-blue-600">₹{portfolio.totalValue.toLocaleString()}</p>
              </div>
              <PieChart className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Invested</p>
                <p className="text-2xl font-bold text-purple-600">₹{portfolio.totalInvested.toLocaleString()}</p>
              </div>
              <Target className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">P&L</p>
                <p className={`text-2xl font-bold ${portfolio.totalGain >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {portfolio.totalGain >= 0 ? "+" : ""}₹{portfolio.totalGain.toLocaleString()}
                </p>
                <p className={`text-sm ${portfolio.totalGain >= 0 ? "text-green-600" : "text-red-600"}`}>
                  ({portfolio.totalGainPercent.toFixed(2)}%)
                </p>
              </div>
              {portfolio.totalGain >= 0 ? (
                <TrendingUp className="h-8 w-8 text-green-500" />
              ) : (
                <AlertTriangle className="h-8 w-8 text-red-500" />
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="trade" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="trade">Trade</TabsTrigger>
          <TabsTrigger value="portfolio">My Portfolio</TabsTrigger>
          <TabsTrigger value="market">Market Watch</TabsTrigger>
        </TabsList>

        <TabsContent value="trade" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Trading Panel */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calculator className="h-5 w-5" />
                  <span>Place Order</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Select Stock</Label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={selectedStock.symbol}
                    onChange={(e) => {
                      const stock = mockStocks.find((s) => s.symbol === e.target.value)
                      if (stock) setSelectedStock(stock)
                    }}
                  >
                    {mockStocks.map((stock) => (
                      <option key={stock.symbol} value={stock.symbol}>
                        {stock.name} - ₹{stock.price}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Order Type</Label>
                    <div className="flex space-x-2">
                      <Button
                        variant={orderType === "buy" ? "default" : "outline"}
                        onClick={() => setOrderType("buy")}
                        className="flex-1"
                      >
                        Buy
                      </Button>
                      <Button
                        variant={orderType === "sell" ? "default" : "outline"}
                        onClick={() => setOrderType("sell")}
                        className="flex-1"
                      >
                        Sell
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))}
                      min="1"
                    />
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span>Total Amount:</span>
                    <span className="font-bold text-lg">₹{(selectedStock.price * quantity).toLocaleString()}</span>
                  </div>
                </div>

                <Button
                  onClick={handleTrade}
                  className="w-full"
                  disabled={orderType === "buy" && selectedStock.price * quantity > virtualCash}
                >
                  {orderType === "buy" ? "Buy Shares" : "Sell Shares"}
                </Button>

                <Button onClick={resetPortfolio} variant="outline" className="w-full">
                  Reset Portfolio
                </Button>
              </CardContent>
            </Card>

            {/* Stock Details */}
            <Card>
              <CardHeader>
                <CardTitle>{selectedStock.name}</CardTitle>
                <CardDescription>{selectedStock.symbol}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-3xl font-bold">₹{selectedStock.price.toLocaleString()}</span>
                    <Badge
                      variant={selectedStock.change >= 0 ? "default" : "destructive"}
                      className={selectedStock.change >= 0 ? "bg-green-500" : ""}
                    >
                      {selectedStock.change >= 0 ? "+" : ""}
                      {selectedStock.change} ({selectedStock.changePercent}%)
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Day's High</p>
                      <p className="font-semibold">₹{(selectedStock.price * 1.02).toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Day's Low</p>
                      <p className="font-semibold">₹{(selectedStock.price * 0.98).toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">52W High</p>
                      <p className="font-semibold">₹{(selectedStock.price * 1.25).toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">52W Low</p>
                      <p className="font-semibold">₹{(selectedStock.price * 0.75).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="portfolio">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <PieChart className="h-5 w-5" />
                <span>My Holdings</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {portfolio.investments.length === 0 ? (
                <div className="text-center py-8">
                  <PieChart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No investments yet. Start trading to build your portfolio!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {portfolio.investments.map((investment) => (
                    <div key={investment.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-semibold">{investment.name}</h4>
                        <p className="text-sm text-gray-600">
                          {investment.quantity} shares @ ₹{investment.price}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">₹{investment.totalValue.toLocaleString()}</p>
                        <Badge
                          variant={investment.change >= 0 ? "default" : "destructive"}
                          className={investment.change >= 0 ? "bg-green-500" : ""}
                        >
                          {investment.change >= 0 ? "+" : ""}
                          {investment.changePercent.toFixed(2)}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="market">
          <Card>
            <CardHeader>
              <CardTitle>Market Watch</CardTitle>
              <CardDescription>Live market data for popular stocks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockStocks.map((stock) => (
                  <div
                    key={stock.symbol}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div>
                      <h4 className="font-semibold">{stock.name}</h4>
                      <p className="text-sm text-gray-600">{stock.symbol}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">₹{stock.price.toLocaleString()}</p>
                      <Badge
                        variant={stock.change >= 0 ? "default" : "destructive"}
                        className={stock.change >= 0 ? "bg-green-500" : ""}
                      >
                        {stock.change >= 0 ? "+" : ""}
                        {stock.change} ({stock.changePercent}%)
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

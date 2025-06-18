"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Zap } from "lucide-react"
import {
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"

interface PortfolioHolding {
  symbol: string
  allocation: number
  value: number
  sector: string
  beta: number
  volatility: number
}

interface RiskMetrics {
  portfolioValue: number
  expectedReturn: number
  volatility: number
  sharpeRatio: number
  beta: number
  var95: number
  var99: number
  maxDrawdown: number
  riskScore: number
  riskLevel: "Low" | "Medium" | "High" | "Very High"
}

export default function RiskAnalyzer() {
  const [holdings, setHoldings] = useState<PortfolioHolding[]>([])
  const [riskMetrics, setRiskMetrics] = useState<RiskMetrics | null>(null)
  const [loading, setLoading] = useState(false)
  const [newHolding, setNewHolding] = useState({ symbol: "", allocation: "", value: "" })

  // Sample portfolio data
  const sampleHoldings: PortfolioHolding[] = [
    { symbol: "RELIANCE", allocation: 25, value: 250000, sector: "Energy", beta: 1.2, volatility: 18.5 },
    { symbol: "TCS", allocation: 20, value: 200000, sector: "IT", beta: 0.8, volatility: 15.2 },
    { symbol: "HDFCBANK", allocation: 15, value: 150000, sector: "Banking", beta: 1.1, volatility: 22.3 },
    { symbol: "INFY", allocation: 15, value: 150000, sector: "IT", beta: 0.9, volatility: 16.8 },
    { symbol: "ICICIBANK", allocation: 10, value: 100000, sector: "Banking", beta: 1.3, volatility: 25.1 },
    { symbol: "WIPRO", allocation: 8, value: 80000, sector: "IT", beta: 0.7, volatility: 19.4 },
    { symbol: "SBIN", allocation: 7, value: 70000, sector: "Banking", beta: 1.4, volatility: 28.2 },
  ]

  useEffect(() => {
    setHoldings(sampleHoldings)
    calculateRiskMetrics(sampleHoldings)
  }, [])

  const calculateRiskMetrics = async (portfolioHoldings: PortfolioHolding[]) => {
    setLoading(true)

    // Simulate complex risk calculations
    setTimeout(() => {
      const totalValue = portfolioHoldings.reduce((sum, holding) => sum + holding.value, 0)
      const weightedBeta = portfolioHoldings.reduce(
        (sum, holding) => sum + (holding.allocation / 100) * holding.beta,
        0,
      )
      const weightedVolatility = Math.sqrt(
        portfolioHoldings.reduce(
          (sum, holding) => sum + Math.pow((holding.allocation / 100) * holding.volatility, 2),
          0,
        ),
      )

      const expectedReturn = 12.5 // Assumed market return
      const riskFreeRate = 6.5 // Current repo rate
      const sharpeRatio = (expectedReturn - riskFreeRate) / weightedVolatility

      // Value at Risk calculations (simplified)
      const var95 = (totalValue * 0.05 * weightedVolatility) / 100
      const var99 = (totalValue * 0.01 * weightedVolatility) / 100

      const riskScore = Math.min(100, (weightedVolatility + weightedBeta * 10) * 2)
      let riskLevel: "Low" | "Medium" | "High" | "Very High" = "Low"

      if (riskScore > 75) riskLevel = "Very High"
      else if (riskScore > 50) riskLevel = "High"
      else if (riskScore > 25) riskLevel = "Medium"

      setRiskMetrics({
        portfolioValue: totalValue,
        expectedReturn,
        volatility: weightedVolatility,
        sharpeRatio,
        beta: weightedBeta,
        var95,
        var99,
        maxDrawdown: 15.2, // Simulated
        riskScore,
        riskLevel,
      })
      setLoading(false)
    }, 2000)
  }

  const addHolding = () => {
    if (newHolding.symbol && newHolding.allocation && newHolding.value) {
      const holding: PortfolioHolding = {
        symbol: newHolding.symbol.toUpperCase(),
        allocation: Number.parseFloat(newHolding.allocation),
        value: Number.parseFloat(newHolding.value),
        sector: "Other", // Would be fetched from API
        beta: 1.0, // Would be fetched from API
        volatility: 20.0, // Would be fetched from API
      }

      const updatedHoldings = [...holdings, holding]
      setHoldings(updatedHoldings)
      calculateRiskMetrics(updatedHoldings)
      setNewHolding({ symbol: "", allocation: "", value: "" })
    }
  }

  const removeHolding = (symbol: string) => {
    const updatedHoldings = holdings.filter((h) => h.symbol !== symbol)
    setHoldings(updatedHoldings)
    calculateRiskMetrics(updatedHoldings)
  }

  // Chart data
  const sectorData = holdings.reduce((acc, holding) => {
    const existing = acc.find((item) => item.sector === holding.sector)
    if (existing) {
      existing.value += holding.value
      existing.allocation += holding.allocation
    } else {
      acc.push({
        sector: holding.sector,
        value: holding.value,
        allocation: holding.allocation,
      })
    }
    return acc
  }, [] as any[])

  const riskData = [
    { name: "Conservative", risk: 15, return: 8 },
    { name: "Moderate", risk: 25, return: 12 },
    { name: "Aggressive", risk: 35, return: 16 },
    { name: "Your Portfolio", risk: riskMetrics?.volatility || 0, return: riskMetrics?.expectedReturn || 0 },
  ]

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

  const getRiskColor = (level: string) => {
    switch (level) {
      case "Low":
        return "text-green-600 bg-green-50 border-green-200"
      case "Medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "High":
        return "text-orange-600 bg-orange-50 border-orange-200"
      case "Very High":
        return "text-red-600 bg-red-50 border-red-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-gray-900">Portfolio Risk Analyzer</h1>
        <p className="text-xl text-gray-600">Comprehensive risk assessment and portfolio optimization</p>
      </div>

      {/* Risk Overview */}
      {riskMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Risk Level</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge className={`text-lg px-3 py-1 ${getRiskColor(riskMetrics.riskLevel)}`}>
                {riskMetrics.riskLevel}
              </Badge>
              <div className="mt-2">
                <Progress value={riskMetrics.riskScore} className="h-2" />
                <p className="text-xs text-gray-500 mt-1">Risk Score: {riskMetrics.riskScore.toFixed(1)}/100</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Portfolio Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">₹{riskMetrics.portfolioValue.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Expected Return: {riskMetrics.expectedReturn}%</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Volatility</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{riskMetrics.volatility.toFixed(1)}%</div>
              <div className="text-sm text-gray-600">Beta: {riskMetrics.beta.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Sharpe Ratio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{riskMetrics.sharpeRatio.toFixed(2)}</div>
              <div className="text-sm text-gray-600">Risk-adjusted return</div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="analysis" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="analysis">Risk Analysis</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
          <TabsTrigger value="recommendations">AI Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="analysis" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sector Allocation */}
            <Card>
              <CardHeader>
                <CardTitle>Sector Allocation</CardTitle>
                <CardDescription>Portfolio diversification by sector</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={sectorData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ sector, allocation }) => `${sector} (${allocation.toFixed(1)}%)`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="allocation"
                    >
                      {sectorData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => [`${value.toFixed(1)}%`, "Allocation"]} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Risk-Return Profile */}
            <Card>
              <CardHeader>
                <CardTitle>Risk-Return Profile</CardTitle>
                <CardDescription>Your portfolio vs standard profiles</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={riskData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="risk" label={{ value: "Risk (%)", position: "insideBottom", offset: -5 }} />
                    <YAxis label={{ value: "Return (%)", angle: -90, position: "insideLeft" }} />
                    <Tooltip
                      formatter={(value: any, name: string) => [
                        `${value}%`,
                        name === "risk" ? "Risk" : "Expected Return",
                      ]}
                    />
                    <Line type="monotone" dataKey="return" stroke="#8884d8" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Risk Metrics */}
          {riskMetrics && (
            <Card>
              <CardHeader>
                <CardTitle>Detailed Risk Metrics</CardTitle>
                <CardDescription>Comprehensive risk assessment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Value at Risk (VaR)</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">95% Confidence</span>
                        <span className="font-medium text-red-600">₹{riskMetrics.var95.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">99% Confidence</span>
                        <span className="font-medium text-red-600">₹{riskMetrics.var99.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Portfolio Metrics</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Beta</span>
                        <span className="font-medium">{riskMetrics.beta.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Max Drawdown</span>
                        <span className="font-medium text-red-600">{riskMetrics.maxDrawdown}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Performance</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Sharpe Ratio</span>
                        <span className="font-medium text-green-600">{riskMetrics.sharpeRatio.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Volatility</span>
                        <span className="font-medium">{riskMetrics.volatility.toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="portfolio" className="space-y-6">
          {/* Add New Holding */}
          <Card>
            <CardHeader>
              <CardTitle>Add New Holding</CardTitle>
              <CardDescription>Add stocks to analyze your portfolio risk</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Input
                  placeholder="Stock Symbol (e.g., RELIANCE)"
                  value={newHolding.symbol}
                  onChange={(e) => setNewHolding({ ...newHolding, symbol: e.target.value })}
                />
                <Input
                  type="number"
                  placeholder="Allocation %"
                  value={newHolding.allocation}
                  onChange={(e) => setNewHolding({ ...newHolding, allocation: e.target.value })}
                />
                <Input
                  type="number"
                  placeholder="Value (₹)"
                  value={newHolding.value}
                  onChange={(e) => setNewHolding({ ...newHolding, value: e.target.value })}
                />
                <Button onClick={addHolding} disabled={loading}>
                  {loading ? "Calculating..." : "Add Holding"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Current Holdings */}
          <Card>
            <CardHeader>
              <CardTitle>Current Holdings</CardTitle>
              <CardDescription>Your portfolio composition and risk metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {holdings.map((holding) => (
                  <div key={holding.symbol} className="flex items-center justify-between p-4 border rounded-md">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div>
                          <div className="font-medium text-lg">{holding.symbol}</div>
                          <div className="text-sm text-gray-600">{holding.sector}</div>
                        </div>
                        <Badge variant="outline">{holding.allocation}%</Badge>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="font-medium">₹{holding.value.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">
                        β: {holding.beta} | σ: {holding.volatility}%
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeHolding(holding.symbol)}
                      className="ml-4 text-red-600 hover:text-red-700"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scenarios" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Stress Testing Scenarios</CardTitle>
              <CardDescription>How your portfolio performs under different market conditions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-md">
                  <h4 className="font-medium text-gray-900 mb-2">Market Crash (-30%)</h4>
                  <div className="text-2xl font-bold text-red-600">
                    -₹{(riskMetrics?.portfolioValue || 0 * 0.3).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Estimated portfolio loss</div>
                </div>
                <div className="p-4 border rounded-md">
                  <h4 className="font-medium text-gray-900 mb-2">Interest Rate Rise (+2%)</h4>
                  <div className="text-2xl font-bold text-orange-600">
                    -₹{(riskMetrics?.portfolioValue || 0 * 0.15).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Banking sector impact</div>
                </div>
                <div className="p-4 border rounded-md">
                  <h4 className="font-medium text-gray-900 mb-2">IT Sector Decline (-25%)</h4>
                  <div className="text-2xl font-bold text-yellow-600">
                    -₹{(riskMetrics?.portfolioValue || 0 * 0.12).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">IT exposure impact</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-blue-600" />
                <span>AI Risk Recommendations</span>
              </CardTitle>
              <CardDescription>Personalized suggestions to optimize your portfolio risk</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                  <h4 className="font-medium text-blue-900 mb-2">🎯 Diversification Recommendations</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Consider reducing IT sector exposure (currently 43% - recommended max 35%)</li>
                    <li>• Add pharmaceutical or FMCG stocks for defensive allocation</li>
                    <li>• Include international diversification through mutual funds</li>
                  </ul>
                </div>

                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                  <h4 className="font-medium text-yellow-900 mb-2">⚠️ Risk Management</h4>
                  <ul className="text-sm text-yellow-800 space-y-1">
                    <li>• Your portfolio beta (1.1) indicates higher market sensitivity</li>
                    <li>• Consider adding low-beta stocks or bonds to reduce volatility</li>
                    <li>• Set stop-loss orders at 15% below current prices</li>
                  </ul>
                </div>

                <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                  <h4 className="font-medium text-green-900 mb-2">✅ Optimization Opportunities</h4>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• Your Sharpe ratio (0.27) can be improved by reducing high-volatility positions</li>
                    <li>• Consider rebalancing quarterly to maintain target allocations</li>
                    <li>• Add gold ETF (5-10%) as inflation hedge</li>
                  </ul>
                </div>

                <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                  <h4 className="font-medium text-red-900 mb-2">🚨 Risk Alerts</h4>
                  <ul className="text-sm text-red-800 space-y-1">
                    <li>• High concentration in banking sector (32%) increases systemic risk</li>
                    <li>• VaR indicates potential 5% daily loss of ₹{(riskMetrics?.var95 || 0).toLocaleString()}</li>
                    <li>• Consider hedging strategies during volatile market periods</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

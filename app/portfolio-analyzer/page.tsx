"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  PieChart,
  TrendingUp,
  AlertTriangle,
  Target,
  ArrowLeft,
  Upload,
  Download,
  RefreshCw,
  BarChart3,
  Shield,
} from "lucide-react"
import Link from "next/link"
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
} from "recharts"

interface Holding {
  symbol: string
  name: string
  quantity: number
  avgPrice: number
  currentPrice: number
  value: number
  allocation: number
  gainLoss: number
  gainLossPercent: number
  category: "equity" | "debt" | "gold" | "real_estate" | "cash"
}

interface PortfolioMetrics {
  totalValue: number
  totalInvestment: number
  totalGainLoss: number
  totalGainLossPercent: number
  diversificationScore: number
  riskScore: number
  expectedReturn: number
  sharpeRatio: number
}

export default function PortfolioAnalyzerPage() {
  const [holdings, setHoldings] = useState<Holding[]>([
    {
      symbol: "RELIANCE",
      name: "Reliance Industries Ltd",
      quantity: 50,
      avgPrice: 2500,
      currentPrice: 2800,
      value: 140000,
      allocation: 28,
      gainLoss: 15000,
      gainLossPercent: 12,
      category: "equity",
    },
    {
      symbol: "HDFCBANK",
      name: "HDFC Bank Ltd",
      quantity: 100,
      avgPrice: 1500,
      currentPrice: 1650,
      value: 165000,
      allocation: 33,
      gainLoss: 15000,
      gainLossPercent: 10,
      category: "equity",
    },
    {
      symbol: "AXIS_BLUECHIP",
      name: "Axis Bluechip Fund",
      quantity: 2000,
      avgPrice: 45,
      currentPrice: 52,
      value: 104000,
      allocation: 20.8,
      gainLoss: 14000,
      gainLossPercent: 15.6,
      category: "equity",
    },
    {
      symbol: "SBI_GOLD_ETF",
      name: "SBI Gold ETF",
      quantity: 200,
      avgPrice: 45,
      currentPrice: 48,
      value: 9600,
      allocation: 1.9,
      gainLoss: 600,
      gainLossPercent: 6.7,
      category: "gold",
    },
  ])

  const [metrics, setMetrics] = useState<PortfolioMetrics>({
    totalValue: 500000,
    totalInvestment: 455000,
    totalGainLoss: 45000,
    totalGainLossPercent: 9.89,
    diversificationScore: 72,
    riskScore: 68,
    expectedReturn: 12.5,
    sharpeRatio: 0.85,
  })

  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [aiInsights, setAiInsights] = useState<string[]>([])

  useEffect(() => {
    calculateMetrics()
    generateAIInsights()
  }, [holdings])

  const calculateMetrics = () => {
    const totalValue = holdings.reduce((sum, holding) => sum + holding.value, 0)
    const totalInvestment = holdings.reduce((sum, holding) => sum + holding.quantity * holding.avgPrice, 0)
    const totalGainLoss = totalValue - totalInvestment
    const totalGainLossPercent = (totalGainLoss / totalInvestment) * 100

    // Calculate diversification score based on allocation spread
    const allocations = holdings.map((h) => h.allocation)
    const maxAllocation = Math.max(...allocations)
    const diversificationScore = Math.max(0, 100 - (maxAllocation - 20) * 2)

    // Calculate risk score based on equity allocation and volatility
    const equityAllocation = holdings.filter((h) => h.category === "equity").reduce((sum, h) => sum + h.allocation, 0)
    const riskScore = Math.min(100, equityAllocation * 0.8 + 20)

    setMetrics({
      totalValue,
      totalInvestment,
      totalGainLoss,
      totalGainLossPercent,
      diversificationScore,
      riskScore,
      expectedReturn: 12.5,
      sharpeRatio: 0.85,
    })
  }

  const generateAIInsights = async () => {
    setIsAnalyzing(true)

    // Simulate AI analysis
    setTimeout(() => {
      const insights = [
        "Your portfolio shows strong concentration in financial sector (33% HDFC Bank). Consider diversifying across sectors.",
        "Excellent performance with 9.89% overall returns. Your stock picking strategy is working well.",
        "Low gold allocation (1.9%) - consider increasing to 5-10% for better hedging against inflation.",
        "High equity allocation (81.8%) suitable for your risk profile, but consider some debt allocation for stability.",
        "Reliance and HDFC Bank are quality picks. Consider adding IT or pharma stocks for sector diversification.",
      ]
      setAiInsights(insights)
      setIsAnalyzing(false)
    }, 2000)
  }

  const allocationData = [
    { name: "Equity", value: 81.8, color: "#3B82F6" },
    { name: "Mutual Funds", value: 16.3, color: "#10B981" },
    { name: "Gold", value: 1.9, color: "#F59E0B" },
  ]

  const performanceData = [
    { month: "Jan", portfolio: 8.2, nifty: 6.5 },
    { month: "Feb", portfolio: 12.1, nifty: 8.9 },
    { month: "Mar", portfolio: 9.8, nifty: 7.2 },
    { month: "Apr", portfolio: 15.3, nifty: 11.8 },
    { month: "May", portfolio: 11.7, nifty: 9.4 },
    { month: "Jun", portfolio: 9.89, nifty: 8.1 },
  ]

  const formatCurrency = (amount: number) => `₹${amount.toLocaleString()}`
  const getGainLossColor = (value: number) => (value >= 0 ? "text-green-600" : "text-red-600")
  const getGainLossBg = (value: number) => (value >= 0 ? "bg-green-50" : "bg-red-50")

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
                <PieChart className="h-6 w-6 text-green-600" />
                <h1 className="text-2xl font-bold">Portfolio Analyzer</h1>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  AI Powered
                </Badge>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm" onClick={generateAIInsights}>
                <RefreshCw className={`h-4 w-4 mr-2 ${isAnalyzing ? "animate-spin" : ""}`} />
                Analyze
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Portfolio Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-sm font-medium text-gray-600">Total Value</h3>
                <TrendingUp className="h-4 w-4 text-blue-500" />
              </div>
              <div className="text-2xl font-bold">{formatCurrency(metrics.totalValue)}</div>
              <div className={`text-sm ${getGainLossColor(metrics.totalGainLoss)}`}>
                {formatCurrency(metrics.totalGainLoss)} ({metrics.totalGainLossPercent.toFixed(2)}%)
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-sm font-medium text-gray-600">Diversification</h3>
                <BarChart3 className="h-4 w-4 text-green-500" />
              </div>
              <div className="text-2xl font-bold">{metrics.diversificationScore}/100</div>
              <Progress value={metrics.diversificationScore} className="h-2 mt-2" />
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-sm font-medium text-gray-600">Risk Score</h3>
                <Shield className="h-4 w-4 text-orange-500" />
              </div>
              <div className="text-2xl font-bold">{metrics.riskScore}/100</div>
              <div className="text-sm text-gray-600">
                {metrics.riskScore > 70 ? "High Risk" : metrics.riskScore > 40 ? "Moderate Risk" : "Low Risk"}
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-sm font-medium text-gray-600">Expected Return</h3>
                <Target className="h-4 w-4 text-purple-500" />
              </div>
              <div className="text-2xl font-bold">{metrics.expectedReturn}%</div>
              <div className="text-sm text-gray-600">Sharpe: {metrics.sharpeRatio}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="holdings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="holdings">Holdings</TabsTrigger>
            <TabsTrigger value="allocation">Allocation</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
          </TabsList>

          {/* Holdings */}
          <TabsContent value="holdings">
            <Card>
              <CardHeader>
                <CardTitle>Portfolio Holdings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {holdings.map((holding) => (
                    <div key={holding.symbol} className={`p-4 rounded-lg border ${getGainLossBg(holding.gainLoss)}`}>
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <div>
                              <h3 className="font-semibold">{holding.symbol}</h3>
                              <p className="text-sm text-gray-600">{holding.name}</p>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {holding.category.toUpperCase()}
                            </Badge>
                          </div>
                          <div className="mt-2 grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Qty:</span> {holding.quantity}
                            </div>
                            <div>
                              <span className="text-gray-600">Avg Price:</span> ₹{holding.avgPrice}
                            </div>
                            <div>
                              <span className="text-gray-600">Current:</span> ₹{holding.currentPrice}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold">{formatCurrency(holding.value)}</div>
                          <div className="text-sm text-gray-600">{holding.allocation}% of portfolio</div>
                          <div className={`text-sm ${getGainLossColor(holding.gainLoss)}`}>
                            {formatCurrency(holding.gainLoss)} ({holding.gainLossPercent.toFixed(1)}%)
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Allocation */}
          <TabsContent value="allocation">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Asset Allocation</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <Pie
                        data={allocationData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name} ${value}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {allocationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recommended Allocation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Equity</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">Current: 81.8%</span>
                        <span className="text-sm text-green-600">Target: 70%</span>
                      </div>
                    </div>
                    <Progress value={81.8} className="h-2" />

                    <div className="flex justify-between items-center">
                      <span>Debt</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">Current: 0%</span>
                        <span className="text-sm text-orange-600">Target: 20%</span>
                      </div>
                    </div>
                    <Progress value={0} className="h-2" />

                    <div className="flex justify-between items-center">
                      <span>Gold</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">Current: 1.9%</span>
                        <span className="text-sm text-yellow-600">Target: 10%</span>
                      </div>
                    </div>
                    <Progress value={1.9} className="h-2" />

                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold mb-2">Rebalancing Suggestions</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Reduce equity allocation by 11.8%</li>
                        <li>• Add debt instruments worth ₹100,000</li>
                        <li>• Increase gold allocation to ₹50,000</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Performance */}
          <TabsContent value="performance">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance vs Nifty 50</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="portfolio"
                        stroke="#3B82F6"
                        strokeWidth={2}
                        name="Your Portfolio"
                      />
                      <Line type="monotone" dataKey="nifty" stroke="#10B981" strokeWidth={2} name="Nifty 50" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Risk Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Beta</span>
                      <span className="font-semibold">1.15</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Alpha</span>
                      <span className="font-semibold text-green-600">2.3%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Sharpe Ratio</span>
                      <span className="font-semibold">0.85</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Max Drawdown</span>
                      <span className="font-semibold text-red-600">-12.5%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Volatility</span>
                      <span className="font-semibold">18.2%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* AI Insights */}
          <TabsContent value="insights">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  <span>AI-Powered Portfolio Insights</span>
                  {isAnalyzing && <Badge variant="outline">Analyzing...</Badge>}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isAnalyzing ? (
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {aiInsights.map((insight, index) => (
                      <div key={index} className="p-4 border-l-4 border-l-blue-500 bg-blue-50 rounded-r-lg">
                        <p className="text-sm">{insight}</p>
                      </div>
                    ))}

                    <div className="mt-6 p-4 bg-green-50 rounded-lg">
                      <h4 className="font-semibold mb-2 text-green-800">Overall Assessment</h4>
                      <p className="text-sm text-green-700">
                        Your portfolio shows strong performance with good stock selection. Consider diversifying across
                        sectors and asset classes for better risk management. The current allocation is suitable for
                        aggressive growth but may benefit from some defensive positions.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

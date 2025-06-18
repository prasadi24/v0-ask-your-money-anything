"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, TrendingDown, Plus, Edit, Trash2, PieChart } from "lucide-react"

interface Investment {
  id: string
  name: string
  type: "mutual_fund" | "stock" | "gold" | "real_estate" | "fd" | "ppf" | "nps"
  amount: number
  currentValue: number
  purchaseDate: string
  quantity?: number
  price?: number
}

interface PortfolioSummary {
  totalInvestment: number
  currentValue: number
  totalGains: number
  totalGainsPercent: number
  dayChange: number
  dayChangePercent: number
}

const investmentTypes = {
  mutual_fund: { label: "Mutual Fund", color: "bg-blue-100 text-blue-800" },
  stock: { label: "Stock", color: "bg-green-100 text-green-800" },
  gold: { label: "Gold", color: "bg-yellow-100 text-yellow-800" },
  real_estate: { label: "Real Estate", color: "bg-purple-100 text-purple-800" },
  fd: { label: "Fixed Deposit", color: "bg-gray-100 text-gray-800" },
  ppf: { label: "PPF", color: "bg-orange-100 text-orange-800" },
  nps: { label: "NPS", color: "bg-indigo-100 text-indigo-800" },
}

export function PortfolioTracker() {
  const [investments, setInvestments] = useState<Investment[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newInvestment, setNewInvestment] = useState({
    name: "",
    type: "mutual_fund" as Investment["type"],
    amount: 0,
    currentValue: 0,
    purchaseDate: "",
    quantity: 0,
    price: 0,
  })

  // Load investments from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("arthagpt_portfolio")
    if (saved) {
      setInvestments(JSON.parse(saved))
    } else {
      // Add sample investments for demo
      const sampleInvestments: Investment[] = [
        {
          id: "1",
          name: "Axis Bluechip Fund",
          type: "mutual_fund",
          amount: 50000,
          currentValue: 58500,
          purchaseDate: "2023-01-15",
          quantity: 1250,
          price: 46.8,
        },
        {
          id: "2",
          name: "HDFC Top 100 Fund",
          type: "mutual_fund",
          amount: 75000,
          currentValue: 89200,
          purchaseDate: "2022-06-10",
          quantity: 1890,
          price: 47.2,
        },
        {
          id: "3",
          name: "SBI Gold ETF",
          type: "gold",
          amount: 25000,
          currentValue: 28400,
          purchaseDate: "2023-03-20",
          quantity: 4,
          price: 6245,
        },
        {
          id: "4",
          name: "Reliance Industries",
          type: "stock",
          amount: 40000,
          currentValue: 45600,
          purchaseDate: "2023-02-05",
          quantity: 15,
          price: 3040,
        },
      ]
      setInvestments(sampleInvestments)
      localStorage.setItem("arthagpt_portfolio", JSON.stringify(sampleInvestments))
    }
  }, [])

  // Save investments to localStorage
  const saveInvestments = (updatedInvestments: Investment[]) => {
    setInvestments(updatedInvestments)
    localStorage.setItem("arthagpt_portfolio", JSON.stringify(updatedInvestments))
  }

  // Calculate portfolio summary
  const calculateSummary = (): PortfolioSummary => {
    const totalInvestment = investments.reduce((sum, inv) => sum + inv.amount, 0)
    const currentValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0)
    const totalGains = currentValue - totalInvestment
    const totalGainsPercent = totalInvestment > 0 ? (totalGains / totalInvestment) * 100 : 0

    // Simulate day change (in real app, this would come from market data)
    const dayChange = currentValue * (Math.random() * 0.04 - 0.02) // -2% to +2%
    const dayChangePercent = currentValue > 0 ? (dayChange / currentValue) * 100 : 0

    return {
      totalInvestment,
      currentValue,
      totalGains,
      totalGainsPercent,
      dayChange,
      dayChangePercent,
    }
  }

  const summary = calculateSummary()

  // Add new investment
  const handleAddInvestment = () => {
    if (!newInvestment.name || newInvestment.amount <= 0) return

    const investment: Investment = {
      id: Date.now().toString(),
      ...newInvestment,
      currentValue: newInvestment.currentValue || newInvestment.amount,
    }

    saveInvestments([...investments, investment])
    setNewInvestment({
      name: "",
      type: "mutual_fund",
      amount: 0,
      currentValue: 0,
      purchaseDate: "",
      quantity: 0,
      price: 0,
    })
    setShowAddForm(false)
  }

  // Delete investment
  const handleDeleteInvestment = (id: string) => {
    if (confirm("Are you sure you want to delete this investment?")) {
      saveInvestments(investments.filter((inv) => inv.id !== id))
    }
  }

  // Calculate allocation percentages
  const getAllocationData = () => {
    const typeAllocations = investments.reduce(
      (acc, inv) => {
        acc[inv.type] = (acc[inv.type] || 0) + inv.currentValue
        return acc
      },
      {} as Record<string, number>,
    )

    return Object.entries(typeAllocations).map(([type, value]) => ({
      type,
      value,
      percentage: (value / summary.currentValue) * 100,
      label: investmentTypes[type as keyof typeof investmentTypes].label,
    }))
  }

  const allocationData = getAllocationData()

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatPercent = (percent: number) => {
    return `${percent >= 0 ? "+" : ""}${percent.toFixed(2)}%`
  }

  return (
    <div className="space-y-6">
      {/* Portfolio Summary */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Investment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(summary.totalInvestment)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Current Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(summary.currentValue)}</div>
            <div className={`text-sm flex items-center ${summary.dayChange >= 0 ? "text-green-600" : "text-red-600"}`}>
              {summary.dayChange >= 0 ? (
                <TrendingUp className="h-3 w-3 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1" />
              )}
              {formatCurrency(Math.abs(summary.dayChange))} ({formatPercent(summary.dayChangePercent)})
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Gains</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${summary.totalGains >= 0 ? "text-green-600" : "text-red-600"}`}>
              {formatCurrency(summary.totalGains)}
            </div>
            <div className={`text-sm ${summary.totalGains >= 0 ? "text-green-600" : "text-red-600"}`}>
              {formatPercent(summary.totalGainsPercent)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Investments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{investments.length}</div>
            <div className="text-sm text-gray-600">Active positions</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="holdings" className="space-y-4">
        <TabsList>
          <TabsTrigger value="holdings">Holdings</TabsTrigger>
          <TabsTrigger value="allocation">Allocation</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        {/* Holdings Tab */}
        <TabsContent value="holdings" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Your Investments</CardTitle>
                <Button onClick={() => setShowAddForm(true)} className="bg-indigo-800 hover:bg-indigo-900">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Investment
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {investments.length === 0 ? (
                <div className="text-center py-8">
                  <PieChart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No investments tracked</h3>
                  <p className="text-gray-600">Add your first investment to start tracking your portfolio.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {investments.map((investment) => {
                    const gains = investment.currentValue - investment.amount
                    const gainsPercent = (gains / investment.amount) * 100

                    return (
                      <div key={investment.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <div>
                              <h3 className="font-medium">{investment.name}</h3>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge className={investmentTypes[investment.type].color}>
                                  {investmentTypes[investment.type].label}
                                </Badge>
                                <span className="text-sm text-gray-600">
                                  {investment.quantity && `${investment.quantity} units`}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="font-semibold">{formatCurrency(investment.currentValue)}</div>
                          <div className="text-sm text-gray-600">Invested: {formatCurrency(investment.amount)}</div>
                          <div className={`text-sm ${gains >= 0 ? "text-green-600" : "text-red-600"}`}>
                            {formatCurrency(gains)} ({formatPercent(gainsPercent)})
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 ml-4">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteInvestment(investment.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Add Investment Form */}
          {showAddForm && (
            <Card>
              <CardHeader>
                <CardTitle>Add New Investment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Investment Name</Label>
                    <Input
                      id="name"
                      value={newInvestment.name}
                      onChange={(e) => setNewInvestment({ ...newInvestment, name: e.target.value })}
                      placeholder="e.g., Axis Bluechip Fund"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <select
                      id="type"
                      value={newInvestment.type}
                      onChange={(e) =>
                        setNewInvestment({ ...newInvestment, type: e.target.value as Investment["type"] })
                      }
                      className="w-full p-2 border rounded-md"
                    >
                      {Object.entries(investmentTypes).map(([key, value]) => (
                        <option key={key} value={key}>
                          {value.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amount">Investment Amount (₹)</Label>
                    <Input
                      id="amount"
                      type="number"
                      value={newInvestment.amount}
                      onChange={(e) => setNewInvestment({ ...newInvestment, amount: Number(e.target.value) })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currentValue">Current Value (₹)</Label>
                    <Input
                      id="currentValue"
                      type="number"
                      value={newInvestment.currentValue}
                      onChange={(e) => setNewInvestment({ ...newInvestment, currentValue: Number(e.target.value) })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="purchaseDate">Purchase Date</Label>
                    <Input
                      id="purchaseDate"
                      type="date"
                      value={newInvestment.purchaseDate}
                      onChange={(e) => setNewInvestment({ ...newInvestment, purchaseDate: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity (Optional)</Label>
                    <Input
                      id="quantity"
                      type="number"
                      value={newInvestment.quantity}
                      onChange={(e) => setNewInvestment({ ...newInvestment, quantity: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button onClick={handleAddInvestment} className="bg-indigo-800 hover:bg-indigo-900">
                    Add Investment
                  </Button>
                  <Button variant="outline" onClick={() => setShowAddForm(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Allocation Tab */}
        <TabsContent value="allocation">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <PieChart className="h-5 w-5" />
                <span>Asset Allocation</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {allocationData.map((item) => (
                  <div key={item.type} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Badge className={investmentTypes[item.type as keyof typeof investmentTypes].color}>
                        {item.label}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{formatCurrency(item.value)}</div>
                      <div className="text-sm text-gray-600">{item.percentage.toFixed(1)}%</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold mb-2">Recommended Allocation for Indian Investors:</h4>
                <ul className="text-sm space-y-1">
                  <li>• Equity (Mutual Funds/Stocks): 60-70%</li>
                  <li>• Debt (FD/PPF/Bonds): 20-25%</li>
                  <li>• Gold: 5-10%</li>
                  <li>• Real Estate: 10-15%</li>
                  <li>• Emergency Fund: 6-12 months expenses</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Performance Analysis</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Top Performers</h4>
                  <div className="space-y-2">
                    {investments
                      .sort((a, b) => (b.currentValue - b.amount) / b.amount - (a.currentValue - a.amount) / a.amount)
                      .slice(0, 3)
                      .map((investment) => {
                        const gainsPercent = ((investment.currentValue - investment.amount) / investment.amount) * 100
                        return (
                          <div
                            key={investment.id}
                            className="flex justify-between items-center p-2 bg-green-50 rounded"
                          >
                            <span className="font-medium">{investment.name}</span>
                            <span className="text-green-600 font-semibold">{formatPercent(gainsPercent)}</span>
                          </div>
                        )
                      })}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Portfolio Insights</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span>Best Performing Asset:</span>
                      <span className="font-semibold">
                        {investments.length > 0
                          ? investments.reduce((best, current) =>
                              (current.currentValue - current.amount) / current.amount >
                              (best.currentValue - best.amount) / best.amount
                                ? current
                                : best,
                            ).name
                          : "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Portfolio Diversification:</span>
                      <span className="font-semibold">
                        {allocationData.length > 3 ? "Well Diversified" : "Needs Diversification"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Risk Level:</span>
                      <span className="font-semibold">
                        {allocationData.find((a) => a.type === "stock" || a.type === "mutual_fund")?.percentage > 60
                          ? "High"
                          : "Moderate"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                <h4 className="font-semibold mb-2">💡 Portfolio Recommendations:</h4>
                <ul className="text-sm space-y-1">
                  <li>• Consider rebalancing if any asset class exceeds 70% allocation</li>
                  <li>• Review and rebalance portfolio quarterly</li>
                  <li>• Maintain emergency fund separate from investments</li>
                  <li>• Consider tax-saving investments (ELSS, PPF, NPS) for Section 80C benefits</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

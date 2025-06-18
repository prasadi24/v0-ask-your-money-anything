"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, TrendingDown, ArrowLeft, Brain, BarChart3, Globe, AlertCircle, Lightbulb } from "lucide-react"
import Link from "next/link"

interface MarketInsight {
  id: string
  title: string
  summary: string
  impact: "high" | "medium" | "low"
  sentiment: "bullish" | "bearish" | "neutral"
  category: "market" | "sector" | "stock" | "economy"
  timestamp: Date
  aiGenerated: boolean
}

interface SectorAnalysis {
  sector: string
  performance: number
  outlook: "positive" | "negative" | "neutral"
  keyStocks: string[]
  reasoning: string
}

export default function MarketInsightsPage() {
  const [insights, setInsights] = useState<MarketInsight[]>([])
  const [sectorAnalysis, setSectorAnalysis] = useState<SectorAnalysis[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  useEffect(() => {
    generateMarketInsights()
    generateSectorAnalysis()
  }, [])

  const generateMarketInsights = async () => {
    setLoading(true)

    // Simulate AI-generated insights
    const mockInsights: MarketInsight[] = [
      {
        id: "1",
        title: "RBI Policy Meeting: Rate Cut Expected",
        summary:
          "Market analysts predict a 25 basis point rate cut in the upcoming RBI monetary policy meeting, which could boost banking and real estate sectors.",
        impact: "high",
        sentiment: "bullish",
        category: "economy",
        timestamp: new Date(),
        aiGenerated: true,
      },
      {
        id: "2",
        title: "IT Sector Shows Strong Q4 Results",
        summary:
          "Major IT companies like TCS, Infosys, and Wipro have reported better-than-expected Q4 results, driven by strong demand in AI and cloud services.",
        impact: "medium",
        sentiment: "bullish",
        category: "sector",
        timestamp: new Date(Date.now() - 3600000),
        aiGenerated: true,
      },
      {
        id: "3",
        title: "FII Outflows Continue in Indian Markets",
        summary:
          "Foreign institutional investors have pulled out ₹15,000 crores from Indian equity markets this month due to global uncertainty and rising US yields.",
        impact: "high",
        sentiment: "bearish",
        category: "market",
        timestamp: new Date(Date.now() - 7200000),
        aiGenerated: false,
      },
      {
        id: "4",
        title: "Reliance Industries Announces Green Energy Push",
        summary:
          "RIL commits ₹75,000 crores for renewable energy projects, potentially making it a key player in India's green transition.",
        impact: "medium",
        sentiment: "bullish",
        category: "stock",
        timestamp: new Date(Date.now() - 10800000),
        aiGenerated: true,
      },
      {
        id: "5",
        title: "Banking Sector NPA Levels Decline",
        summary:
          "Indian banks report lowest NPA levels in 8 years, with improved asset quality and strong provisioning coverage ratios.",
        impact: "medium",
        sentiment: "bullish",
        category: "sector",
        timestamp: new Date(Date.now() - 14400000),
        aiGenerated: true,
      },
    ]

    setInsights(mockInsights)
    setLoading(false)
  }

  const generateSectorAnalysis = async () => {
    const mockSectorAnalysis: SectorAnalysis[] = [
      {
        sector: "Information Technology",
        performance: 15.2,
        outlook: "positive",
        keyStocks: ["TCS", "INFY", "WIPRO", "HCLTECH"],
        reasoning:
          "Strong demand for AI/ML services, cloud migration, and digital transformation driving growth. Margin expansion expected.",
      },
      {
        sector: "Banking & Financial Services",
        performance: 8.7,
        outlook: "positive",
        keyStocks: ["HDFCBANK", "ICICIBANK", "KOTAKBANK", "SBIN"],
        reasoning:
          "Improving asset quality, declining NPAs, and potential rate cuts creating favorable environment for banks.",
      },
      {
        sector: "Pharmaceuticals",
        performance: 12.3,
        outlook: "neutral",
        keyStocks: ["SUNPHARMA", "DRREDDY", "CIPLA", "LUPIN"],
        reasoning:
          "Mixed performance with generic pricing pressure offset by specialty drug approvals and emerging market growth.",
      },
      {
        sector: "Automobile",
        performance: -2.1,
        outlook: "negative",
        keyStocks: ["MARUTI", "TATAMOTORS", "M&M", "BAJAJ-AUTO"],
        reasoning:
          "Weak rural demand, high inventory levels, and transition to electric vehicles creating near-term challenges.",
      },
      {
        sector: "FMCG",
        performance: 6.8,
        outlook: "neutral",
        keyStocks: ["HINDUNILVR", "ITC", "NESTLEIND", "BRITANNIA"],
        reasoning: "Steady growth but margin pressure from commodity inflation. Rural recovery key for acceleration.",
      },
    ]

    setSectorAnalysis(mockSectorAnalysis)
  }

  const filteredInsights =
    selectedCategory === "all" ? insights : insights.filter((insight) => insight.category === selectedCategory)

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "bullish":
        return "text-green-600"
      case "bearish":
        return "text-red-600"
      case "neutral":
        return "text-gray-600"
      default:
        return "text-gray-600"
    }
  }

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "bullish":
        return <TrendingUp className="h-4 w-4" />
      case "bearish":
        return <TrendingDown className="h-4 w-4" />
      default:
        return <BarChart3 className="h-4 w-4" />
    }
  }

  const getOutlookColor = (outlook: string) => {
    switch (outlook) {
      case "positive":
        return "text-green-600"
      case "negative":
        return "text-red-600"
      case "neutral":
        return "text-yellow-600"
      default:
        return "text-gray-600"
    }
  }

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
                <Brain className="h-6 w-6 text-purple-600" />
                <h1 className="text-2xl font-bold">Market Insights</h1>
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                  AI Generated
                </Badge>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                Last Updated: {new Date().toLocaleTimeString()}
              </Badge>
              <Button variant="outline" size="sm" onClick={generateMarketInsights}>
                Refresh Insights
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="insights" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="insights">Market Insights</TabsTrigger>
            <TabsTrigger value="sectors">Sector Analysis</TabsTrigger>
            <TabsTrigger value="trends">AI Trends</TabsTrigger>
          </TabsList>

          {/* Market Insights */}
          <TabsContent value="insights">
            <div className="space-y-6">
              {/* Filter Buttons */}
              <div className="flex space-x-2">
                {["all", "market", "sector", "stock", "economy"].map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Button>
                ))}
              </div>

              {/* Insights Grid */}
              <div className="grid gap-6">
                {filteredInsights.map((insight) => (
                  <Card key={insight.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-2">{insight.title}</CardTitle>
                          <div className="flex items-center space-x-2">
                            <Badge className={getImpactColor(insight.impact)}>
                              {insight.impact.toUpperCase()} IMPACT
                            </Badge>
                            <div className={`flex items-center space-x-1 ${getSentimentColor(insight.sentiment)}`}>
                              {getSentimentIcon(insight.sentiment)}
                              <span className="text-sm font-medium">{insight.sentiment.toUpperCase()}</span>
                            </div>
                            {insight.aiGenerated && (
                              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                                <Brain className="h-3 w-3 mr-1" />
                                AI Generated
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">{insight.timestamp.toLocaleTimeString()}</div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 leading-relaxed">{insight.summary}</p>
                      <div className="mt-4 flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          {insight.category.toUpperCase()}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          Read More
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Sector Analysis */}
          <TabsContent value="sectors">
            <div className="grid gap-6">
              {sectorAnalysis.map((sector) => (
                <Card key={sector.sector}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{sector.sector}</CardTitle>
                      <div className="flex items-center space-x-3">
                        <div
                          className={`text-lg font-bold ${sector.performance >= 0 ? "text-green-600" : "text-red-600"}`}
                        >
                          {sector.performance >= 0 ? "+" : ""}
                          {sector.performance}%
                        </div>
                        <Badge className={`${getOutlookColor(sector.outlook)} bg-opacity-10`}>
                          {sector.outlook.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-gray-700">{sector.reasoning}</p>

                      <div>
                        <h4 className="font-semibold mb-2">Key Stocks to Watch:</h4>
                        <div className="flex flex-wrap gap-2">
                          {sector.keyStocks.map((stock) => (
                            <Badge key={stock} variant="outline" className="text-xs">
                              {stock}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* AI Trends */}
          <TabsContent value="trends">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Lightbulb className="h-5 w-5 text-yellow-600" />
                    <span>AI Market Predictions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-2">Next Week Outlook</h4>
                      <p className="text-sm text-blue-700">
                        AI models predict a 68% probability of market consolidation between 22,000-22,500 for Nifty 50,
                        with banking stocks likely to outperform.
                      </p>
                    </div>

                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-semibold text-green-800 mb-2">Sector Rotation</h4>
                      <p className="text-sm text-green-700">
                        Machine learning algorithms detect early signs of rotation from growth to value stocks,
                        particularly in banking and energy sectors.
                      </p>
                    </div>

                    <div className="p-4 bg-yellow-50 rounded-lg">
                      <h4 className="font-semibold text-yellow-800 mb-2">Volatility Alert</h4>
                      <p className="text-sm text-yellow-700">
                        VIX models suggest increased volatility around RBI policy announcement. Consider hedging
                        strategies for large positions.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Globe className="h-5 w-5 text-blue-600" />
                    <span>Global Market Sentiment</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 border rounded">
                      <span className="font-medium">US Markets</span>
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span className="text-green-600">Bullish</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center p-3 border rounded">
                      <span className="font-medium">European Markets</span>
                      <div className="flex items-center space-x-2">
                        <BarChart3 className="h-4 w-4 text-yellow-600" />
                        <span className="text-yellow-600">Neutral</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center p-3 border rounded">
                      <span className="font-medium">Asian Markets</span>
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span className="text-green-600">Bullish</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center p-3 border rounded">
                      <span className="font-medium">Emerging Markets</span>
                      <div className="flex items-center space-x-2">
                        <TrendingDown className="h-4 w-4 text-red-600" />
                        <span className="text-red-600">Bearish</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* AI Disclaimer */}
        <Card className="mt-8 border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-orange-800 mb-2">AI-Generated Insights Disclaimer</h3>
                <p className="text-sm text-orange-700">
                  These insights are generated using advanced AI models and should be used for informational purposes
                  only. Always consult with qualified financial advisors before making investment decisions. Past
                  performance does not guarantee future results.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

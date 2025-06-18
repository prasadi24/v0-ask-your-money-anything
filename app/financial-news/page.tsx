"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Newspaper, Globe, Search, Clock, ExternalLink, Zap } from "lucide-react"

interface NewsArticle {
  id: string
  title: string
  summary: string
  content: string
  source: string
  category: string
  sentiment: "positive" | "negative" | "neutral"
  impact: "high" | "medium" | "low"
  timestamp: Date
  stocks: string[]
  aiInsight: string
}

export default function FinancialNews() {
  const [news, setNews] = useState<NewsArticle[]>([])
  const [filteredNews, setFilteredNews] = useState<NewsArticle[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [loading, setLoading] = useState(false)
  const [aiAnalysis, setAiAnalysis] = useState("")

  // Mock news data - in real app, this would come from news APIs + AI analysis
  const mockNews: NewsArticle[] = [
    {
      id: "1",
      title: "RBI Keeps Repo Rate Unchanged at 6.5% - Market Rally Expected",
      summary:
        "Reserve Bank of India maintains status quo on interest rates, citing inflation concerns and growth stability.",
      content:
        "The Reserve Bank of India (RBI) has decided to keep the repo rate unchanged at 6.5% in its latest monetary policy review. The decision comes amid concerns about persistent inflation and the need to maintain economic growth momentum. Market experts believe this decision will provide stability to the banking sector and may trigger a rally in interest-sensitive stocks.",
      source: "Economic Times",
      category: "monetary-policy",
      sentiment: "positive",
      impact: "high",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      stocks: ["HDFCBANK", "ICICIBANK", "SBIN", "AXISBANK"],
      aiInsight:
        "This decision is likely to benefit banking stocks as it maintains net interest margins. Real estate and auto sectors may also see positive movement due to stable borrowing costs.",
    },
    {
      id: "2",
      title: "Reliance Industries Q3 Results Beat Estimates - Stock Surges 5%",
      summary: "RIL reports strong quarterly performance driven by petrochemicals and retail segments.",
      content:
        "Reliance Industries Limited has reported better-than-expected Q3 results with net profit rising 12% YoY to ₹18,549 crores. The company's petrochemicals business showed robust performance while Jio and retail segments continued their growth trajectory. The stock surged 5% in after-hours trading.",
      source: "Business Standard",
      category: "earnings",
      sentiment: "positive",
      impact: "high",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      stocks: ["RELIANCE"],
      aiInsight:
        "Strong fundamentals across all business segments. The diversified revenue stream provides stability. Expect continued outperformance in the energy and retail space.",
    },
    {
      id: "3",
      title: "IT Sector Faces Headwinds as US Banking Crisis Deepens",
      summary: "Indian IT companies may see reduced spending from US financial clients amid banking sector turmoil.",
      content:
        "The ongoing crisis in the US banking sector is expected to impact Indian IT services companies as financial institutions cut back on technology spending. Major players like TCS, Infosys, and Wipro derive significant revenue from US banking clients.",
      source: "Mint",
      category: "sector-analysis",
      sentiment: "negative",
      impact: "medium",
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      stocks: ["TCS", "INFY", "WIPRO", "HCLTECH"],
      aiInsight:
        "Short-term headwinds expected, but Indian IT companies have diversified client base. Focus on companies with strong non-BFSI revenue streams.",
    },
    {
      id: "4",
      title: "Green Energy Push: Government Announces ₹50,000 Crore Solar Initiative",
      summary: "New policy framework aims to boost solar capacity and create manufacturing jobs.",
      content:
        "The government has unveiled a comprehensive ₹50,000 crore initiative to boost solar energy capacity and establish domestic manufacturing capabilities. The program includes subsidies for rooftop solar installations and incentives for solar equipment manufacturers.",
      source: "Hindu BusinessLine",
      category: "policy",
      sentiment: "positive",
      impact: "high",
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
      stocks: ["ADANIGREEN", "TATAPOWER", "SUZLON"],
      aiInsight:
        "Massive opportunity for renewable energy companies. Expect significant government support and policy tailwinds. Solar equipment manufacturers will benefit most.",
    },
    {
      id: "5",
      title: "Cryptocurrency Regulations: RBI Proposes Digital Rupee Framework",
      summary: "Central bank outlines roadmap for Central Bank Digital Currency implementation.",
      content:
        "The Reserve Bank of India has released a comprehensive framework for the implementation of the Digital Rupee (e₹). The framework addresses privacy concerns, transaction limits, and integration with existing banking infrastructure.",
      source: "Financial Express",
      category: "fintech",
      sentiment: "neutral",
      impact: "medium",
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
      stocks: ["PAYTM", "POLICYBZR"],
      aiInsight:
        "Mixed impact on fintech companies. While CBDC may reduce some use cases, it also validates digital payment ecosystem. Companies with strong compliance will benefit.",
    },
  ]

  useEffect(() => {
    setNews(mockNews)
    setFilteredNews(mockNews)
    generateMarketAnalysis()
  }, [])

  useEffect(() => {
    let filtered = news

    if (searchTerm) {
      filtered = filtered.filter(
        (article) =>
          article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.stocks.some((stock) => stock.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((article) => article.category === selectedCategory)
    }

    setFilteredNews(filtered)
  }, [searchTerm, selectedCategory, news])

  const generateMarketAnalysis = async () => {
    setLoading(true)
    // Simulate AI analysis using Groq API
    setTimeout(() => {
      setAiAnalysis(`
**Market Sentiment Analysis (AI-Generated)**

📈 **Overall Market Outlook**: BULLISH
- Banking sector showing strength with stable monetary policy
- Energy transition creating new opportunities
- IT sector facing near-term challenges but long-term prospects remain intact

🎯 **Key Themes**:
1. **Interest Rate Stability**: Benefits banking and real estate sectors
2. **Green Energy Boom**: Government support driving renewable energy stocks
3. **Digital Transformation**: CBDC framework validates fintech ecosystem

⚠️ **Risk Factors**:
- US banking crisis spillover effects on IT sector
- Inflation concerns may limit policy flexibility
- Global economic uncertainty affecting export-oriented sectors

🔥 **Hot Sectors**: Banking, Renewable Energy, Pharmaceuticals
❄️ **Cool Sectors**: IT Services, Metals, Textiles
      `)
      setLoading(false)
    }, 2000)
  }

  const categories = [
    { id: "all", label: "All News", count: news.length },
    { id: "earnings", label: "Earnings", count: news.filter((n) => n.category === "earnings").length },
    {
      id: "monetary-policy",
      label: "Monetary Policy",
      count: news.filter((n) => n.category === "monetary-policy").length,
    },
    {
      id: "sector-analysis",
      label: "Sector Analysis",
      count: news.filter((n) => n.category === "sector-analysis").length,
    },
    { id: "policy", label: "Policy", count: news.filter((n) => n.category === "policy").length },
    { id: "fintech", label: "Fintech", count: news.filter((n) => n.category === "fintech").length },
  ]

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "bg-green-100 text-green-800 border-green-200"
      case "negative":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-blue-100 text-blue-800 border-blue-200"
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-gray-900">Financial News & AI Analysis</h1>
        <p className="text-xl text-gray-600">Stay updated with AI-powered market insights and news analysis</p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search news, stocks, or topics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={generateMarketAnalysis} disabled={loading} className="flex items-center space-x-2">
          <Zap className="h-4 w-4" />
          <span>{loading ? "Analyzing..." : "AI Market Analysis"}</span>
        </Button>
      </div>

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
          {categories.map((category) => (
            <TabsTrigger key={category.id} value={category.id} className="text-xs">
              {category.label} ({category.count})
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* News Feed */}
          <div className="lg:col-span-2 space-y-4">
            {filteredNews.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <Newspaper className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No news found matching your criteria.</p>
                </CardContent>
              </Card>
            ) : (
              filteredNews.map((article) => (
                <Card key={article.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg leading-tight mb-2">{article.title}</CardTitle>
                        <CardDescription className="text-sm">{article.summary}</CardDescription>
                      </div>
                      <div className="flex flex-col items-end space-y-2 ml-4">
                        <Badge className={getSentimentColor(article.sentiment)}>{article.sentiment}</Badge>
                        <Badge className={getImpactColor(article.impact)}>{article.impact} impact</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-700 leading-relaxed">{article.content}</p>

                    {/* Affected Stocks */}
                    {article.stocks.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-gray-600 mb-2">Affected Stocks:</p>
                        <div className="flex flex-wrap gap-1">
                          {article.stocks.map((stock) => (
                            <Badge key={stock} variant="outline" className="text-xs">
                              {stock}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* AI Insight */}
                    <div className="bg-blue-50 p-3 rounded-md border border-blue-200">
                      <div className="flex items-center space-x-2 mb-2">
                        <Zap className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-800">AI Insight</span>
                      </div>
                      <p className="text-sm text-blue-700">{article.aiInsight}</p>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center space-x-1">
                          <Globe className="h-3 w-3" />
                          <span>{article.source}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{article.timestamp.toLocaleString()}</span>
                        </span>
                      </div>
                      <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Read More
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* AI Analysis Sidebar */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-blue-600" />
                  <span>AI Market Analysis</span>
                </CardTitle>
                <CardDescription>Real-time sentiment and trend analysis</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-sm text-gray-500 mt-2">Analyzing market sentiment...</p>
                  </div>
                ) : (
                  <div className="prose prose-sm max-w-none">
                    <pre className="whitespace-pre-wrap text-xs leading-relaxed">{aiAnalysis}</pre>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>News Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Positive News</span>
                  <Badge className="bg-green-100 text-green-800">
                    {news.filter((n) => n.sentiment === "positive").length}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Negative News</span>
                  <Badge className="bg-red-100 text-red-800">
                    {news.filter((n) => n.sentiment === "negative").length}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">High Impact</span>
                  <Badge className="bg-orange-100 text-orange-800">
                    {news.filter((n) => n.impact === "high").length}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Tabs>
    </div>
  )
}

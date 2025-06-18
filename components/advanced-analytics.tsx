"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts"
import {
  TrendingUp,
  Users,
  MessageSquare,
  Target,
  Clock,
  Download,
  Activity,
  DollarSign,
  PieChartIcon,
  AlertTriangle,
} from "lucide-react"

interface AnalyticsData {
  userMetrics: {
    totalUsers: number
    activeUsers: number
    newUsers: number
    retentionRate: number
  }
  queryMetrics: {
    totalQueries: number
    avgResponseTime: number
    successRate: number
    topCategories: { category: string; count: number; percentage: number }[]
  }
  recommendationMetrics: {
    totalRecommendations: number
    acceptanceRate: number
    avgPortfolioValue: number
    topProducts: { product: string; recommendations: number }[]
  }
  performanceMetrics: {
    systemUptime: number
    avgLoadTime: number
    errorRate: number
    apiCalls: number
  }
}

export function AdvancedAnalytics() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [selectedTimeRange, setSelectedTimeRange] = useState("7d")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAnalyticsData()
  }, [selectedTimeRange])

  const loadAnalyticsData = async () => {
    setLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const mockData: AnalyticsData = {
      userMetrics: {
        totalUsers: 12847,
        activeUsers: 3421,
        newUsers: 287,
        retentionRate: 78.5,
      },
      queryMetrics: {
        totalQueries: 45623,
        avgResponseTime: 1.2,
        successRate: 97.8,
        topCategories: [
          { category: "Mutual Funds", count: 18249, percentage: 40 },
          { category: "Real Estate", count: 13687, percentage: 30 },
          { category: "Gold Investment", count: 9125, percentage: 20 },
          { category: "Insurance", count: 4562, percentage: 10 },
        ],
      },
      recommendationMetrics: {
        totalRecommendations: 8934,
        acceptanceRate: 68.2,
        avgPortfolioValue: 485000,
        topProducts: [
          { product: "Axis Bluechip Fund", recommendations: 1247 },
          { product: "HDFC Top 100 Fund", recommendations: 1156 },
          { product: "SBI Gold ETF", recommendations: 987 },
          { product: "HDFC Life Insurance", recommendations: 834 },
        ],
      },
      performanceMetrics: {
        systemUptime: 99.9,
        avgLoadTime: 0.8,
        errorRate: 0.2,
        apiCalls: 156789,
      },
    }

    setAnalyticsData(mockData)
    setLoading(false)
  }

  const userGrowthData = [
    { month: "Jan", users: 8500, active: 2100 },
    { month: "Feb", users: 9200, active: 2400 },
    { month: "Mar", users: 10100, active: 2800 },
    { month: "Apr", users: 11200, active: 3100 },
    { month: "May", users: 12000, active: 3300 },
    { month: "Jun", users: 12847, active: 3421 },
  ]

  const queryTrendsData = [
    { day: "Mon", queries: 6500, success: 6370 },
    { day: "Tue", queries: 7200, success: 7056 },
    { day: "Wed", queries: 6800, success: 6664 },
    { day: "Thu", queries: 7500, success: 7350 },
    { day: "Fri", queries: 8200, success: 8036 },
    { day: "Sat", queries: 5400, success: 5292 },
    { day: "Sun", queries: 4023, success: 3942 },
  ]

  const responseTimeData = [
    { hour: "00", time: 0.9 },
    { hour: "04", time: 0.7 },
    { hour: "08", time: 1.2 },
    { hour: "12", time: 1.8 },
    { hour: "16", time: 2.1 },
    { hour: "20", time: 1.4 },
  ]

  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"]

  const exportAnalytics = (format: "pdf" | "excel") => {
    // Mock export functionality
    console.log(`Exporting analytics as ${format}`)
    // In production, generate and download actual reports
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Advanced Analytics</h1>
          <p className="text-gray-600">Comprehensive insights into ArthaGPT performance and user behavior</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex space-x-2">
            {["1d", "7d", "30d", "90d"].map((range) => (
              <Button
                key={range}
                variant={selectedTimeRange === range ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTimeRange(range)}
              >
                {range}
              </Button>
            ))}
          </div>
          <Button variant="outline" onClick={() => exportAnalytics("excel")}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData?.userMetrics.totalUsers.toLocaleString()}</div>
            <div className="text-sm text-green-600 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />+{analyticsData?.userMetrics.newUsers} new this week
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <MessageSquare className="h-4 w-4 mr-2" />
              Total Queries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData?.queryMetrics.totalQueries.toLocaleString()}</div>
            <div className="text-sm text-blue-600">{analyticsData?.queryMetrics.successRate}% success rate</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Target className="h-4 w-4 mr-2" />
              Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analyticsData?.recommendationMetrics.totalRecommendations.toLocaleString()}
            </div>
            <div className="text-sm text-green-600">
              {analyticsData?.recommendationMetrics.acceptanceRate}% acceptance rate
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              Avg Response Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData?.queryMetrics.avgResponseTime}s</div>
            <div className="text-sm text-gray-600">{analyticsData?.performanceMetrics.systemUptime}% uptime</div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="queries">Queries</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>User Growth Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={userGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="users"
                      stackId="1"
                      stroke="#3B82F6"
                      fill="#3B82F6"
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="active"
                      stackId="2"
                      stroke="#10B981"
                      fill="#10B981"
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Engagement Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Active Users</span>
                      <span className="text-sm text-gray-600">
                        {analyticsData?.userMetrics.activeUsers} / {analyticsData?.userMetrics.totalUsers}
                      </span>
                    </div>
                    <Progress
                      value={(analyticsData?.userMetrics.activeUsers! / analyticsData?.userMetrics.totalUsers!) * 100}
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Retention Rate</span>
                      <span className="text-sm text-gray-600">{analyticsData?.userMetrics.retentionRate}%</span>
                    </div>
                    <Progress value={analyticsData?.userMetrics.retentionRate} />
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{analyticsData?.userMetrics.newUsers}</div>
                      <div className="text-sm text-gray-600">New Users</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {Math.round(
                          (analyticsData?.userMetrics.activeUsers! / analyticsData?.userMetrics.totalUsers!) * 100,
                        )}
                        %
                      </div>
                      <div className="text-sm text-gray-600">Engagement</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Queries Tab */}
        <TabsContent value="queries">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Query Volume by Day</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={queryTrendsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="queries" fill="#3B82F6" />
                    <Bar dataKey="success" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Query Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analyticsData?.queryMetrics.topCategories}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ category, percentage }) => `${category} ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {analyticsData?.queryMetrics.topCategories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Recommendations Tab */}
        <TabsContent value="recommendations">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Recommended Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData?.recommendationMetrics.topProducts.map((product, index) => (
                    <div key={product.product} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-semibold text-blue-600">{index + 1}</span>
                        </div>
                        <span className="font-medium">{product.product}</span>
                      </div>
                      <Badge variant="outline">{product.recommendations}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recommendation Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg">
                    <div className="text-3xl font-bold text-gray-900 mb-2">
                      ₹{(analyticsData?.recommendationMetrics.avgPortfolioValue! / 100000).toFixed(1)}L
                    </div>
                    <div className="text-sm text-gray-600">Average Portfolio Value</div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-xl font-bold text-green-600">
                        {analyticsData?.recommendationMetrics.acceptanceRate}%
                      </div>
                      <div className="text-sm text-gray-600">Acceptance Rate</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-xl font-bold text-blue-600">
                        {analyticsData?.recommendationMetrics.totalRecommendations}
                      </div>
                      <div className="text-sm text-gray-600">Total Recommendations</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Response Time Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={responseTimeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="time" stroke="#3B82F6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Activity className="h-5 w-5 text-green-600" />
                      <span className="font-medium">System Uptime</span>
                    </div>
                    <span className="text-lg font-bold text-green-600">
                      {analyticsData?.performanceMetrics.systemUptime}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Clock className="h-5 w-5 text-blue-600" />
                      <span className="font-medium">Avg Load Time</span>
                    </div>
                    <span className="text-lg font-bold text-blue-600">
                      {analyticsData?.performanceMetrics.avgLoadTime}s
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                      <span className="font-medium">Error Rate</span>
                    </div>
                    <span className="text-lg font-bold text-red-600">
                      {analyticsData?.performanceMetrics.errorRate}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <DollarSign className="h-5 w-5 text-purple-600" />
                      <span className="font-medium">API Calls</span>
                    </div>
                    <span className="text-lg font-bold text-purple-600">
                      {analyticsData?.performanceMetrics.apiCalls.toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Insights Tab */}
        <TabsContent value="insights">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <PieChartIcon className="h-5 w-5" />
                  <span>AI-Powered Insights</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Key Findings</h3>
                    <div className="space-y-3">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <div className="font-medium text-blue-800">Peak Usage Hours</div>
                        <div className="text-sm text-blue-600">
                          Most queries occur between 4-8 PM IST, suggesting users research investments after work hours.
                        </div>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg">
                        <div className="font-medium text-green-800">High Engagement Categories</div>
                        <div className="text-sm text-green-600">
                          Mutual fund queries have 95% completion rate, indicating strong user interest in systematic
                          investing.
                        </div>
                      </div>
                      <div className="p-4 bg-yellow-50 rounded-lg">
                        <div className="font-medium text-yellow-800">Recommendation Acceptance</div>
                        <div className="text-sm text-yellow-600">
                          Users aged 25-35 show highest acceptance rate (78%) for AI-generated investment
                          recommendations.
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Optimization Opportunities</h3>
                    <div className="space-y-3">
                      <div className="p-4 border-l-4 border-blue-500 bg-gray-50">
                        <div className="font-medium">Response Time Optimization</div>
                        <div className="text-sm text-gray-600">
                          Implement caching for frequently asked mutual fund queries to reduce response time by 40%.
                        </div>
                      </div>
                      <div className="p-4 border-l-4 border-green-500 bg-gray-50">
                        <div className="font-medium">Content Enhancement</div>
                        <div className="text-sm text-gray-600">
                          Add more real estate content for tier-2 cities to address 23% of unanswered queries.
                        </div>
                      </div>
                      <div className="p-4 border-l-4 border-purple-500 bg-gray-50">
                        <div className="font-medium">User Experience</div>
                        <div className="text-sm text-gray-600">
                          Implement voice search to capture mobile users who prefer audio queries (18% of traffic).
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

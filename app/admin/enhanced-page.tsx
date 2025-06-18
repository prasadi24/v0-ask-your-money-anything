"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Coins, Settings, BarChart3, Shield, Rocket, Database } from "lucide-react"
import Link from "next/link"

// Import all the enhanced components
import { FreeUpload } from "@/components/free-upload"
import { DocumentStats } from "@/components/document-stats"
import { DocumentManager } from "@/components/document-manager"
import { QueryLogger } from "@/components/query-logger"
import { EnhancedSampleDocuments } from "@/components/enhanced-sample-documents"
import { AdvancedAnalytics } from "@/components/advanced-analytics"
import { SecurityDashboard } from "@/components/security-dashboard"
import { ProductionDeployment } from "@/components/production-deployment"
import { MarketDataWidget } from "@/components/market-data-widget"

export default function EnhancedAdminPage() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Header */}
      <header className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Coins className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">ArthaGPT</h1>
              <p className="text-sm text-gray-600">Production Admin Dashboard</p>
            </div>
          </Link>
          <nav className="flex items-center space-x-4">
            <Link href="/ask">
              <Button variant="ghost">Ask Questions</Button>
            </Link>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Rocket className="h-4 w-4 mr-2" />
              Deploy
            </Button>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Enhanced Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <DocumentStats />
        </div>

        {/* Live Market Data Widget */}
        <div className="mb-8">
          <MarketDataWidget />
        </div>

        {/* Enhanced Admin Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center space-x-2">
              <Database className="h-4 w-4" />
              <span>Documents</span>
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Upload</span>
            </TabsTrigger>
            <TabsTrigger value="samples">Sample Data</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="security" className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>Security</span>
            </TabsTrigger>
            <TabsTrigger value="deployment" className="flex items-center space-x-2">
              <Rocket className="h-4 w-4" />
              <span>Deploy</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>System Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">AI Services</span>
                        <Badge className="bg-green-100 text-green-800">Operational</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Database</span>
                        <Badge className="bg-green-100 text-green-800">Connected</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Market Data</span>
                        <Badge className="bg-yellow-100 text-yellow-800">Demo Mode</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Authentication</span>
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>New user registered - 2 minutes ago</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Document processed - 5 minutes ago</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span>Investment recommendation generated - 8 minutes ago</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <span>Market data updated - 12 minutes ago</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <QueryLogger />
            </div>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents">
            <DocumentManager />
          </TabsContent>

          {/* Upload Tab */}
          <TabsContent value="upload">
            <FreeUpload />
          </TabsContent>

          {/* Sample Data Tab */}
          <TabsContent value="samples">
            <EnhancedSampleDocuments />
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <AdvancedAnalytics />
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <SecurityDashboard />
          </TabsContent>

          {/* Deployment Tab */}
          <TabsContent value="deployment">
            <ProductionDeployment />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

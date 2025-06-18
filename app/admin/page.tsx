"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Brain, Upload, FileText, Activity, Users, MessageSquare, TrendingUp } from "lucide-react"
import Link from "next/link"

interface Document {
  id: string
  name: string
  type: string
  size: string
  uploadDate: string
  status: "processed" | "processing" | "failed"
}

interface QueryLog {
  id: string
  question: string
  response: string
  timestamp: string
  userId: string
  sources: string[]
}

const mockDocuments: Document[] = [
  {
    id: "1",
    name: "Axis Bluechip Fund Factsheet March 2024.pdf",
    type: "Mutual Fund",
    size: "2.3 MB",
    uploadDate: "2024-03-15",
    status: "processed",
  },
  {
    id: "2",
    name: "Gold Price Report RBI Q1 2024.pdf",
    type: "Commodity Report",
    size: "1.8 MB",
    uploadDate: "2024-03-10",
    status: "processed",
  },
  {
    id: "3",
    name: "Amaravati Real Estate Trends 2024.pdf",
    type: "Real Estate",
    size: "3.1 MB",
    uploadDate: "2024-03-08",
    status: "processing",
  },
]

const mockQueryLogs: QueryLog[] = [
  {
    id: "1",
    question: "How did Axis Bluechip Fund perform in the last 5 years?",
    response: "Axis Bluechip Fund has delivered an annualized return of 13.2% over the last 5 years...",
    timestamp: "2024-03-15 14:30:00",
    userId: "user123",
    sources: ["Axis Bluechip Fund Factsheet March 2024.pdf"],
  },
  {
    id: "2",
    question: "What are the current gold prices?",
    response: "Current gold prices are ₹6,245 per gram for 24K gold...",
    timestamp: "2024-03-15 13:45:00",
    userId: "user456",
    sources: ["Gold Price Report RBI Q1 2024.pdf"],
  },
]

export default function AdminPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setIsUploading(true)
    setUploadProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          setSelectedFile(null)
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  const getStatusBadge = (status: Document["status"]) => {
    switch (status) {
      case "processed":
        return <Badge className="bg-green-100 text-green-800">Processed</Badge>
      case "processing":
        return <Badge className="bg-yellow-100 text-yellow-800">Processing</Badge>
      case "failed":
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">FinGPT Admin</h1>
          </Link>
          <nav className="flex items-center space-x-4">
            <Link href="/ask">
              <Button variant="ghost">Ask Questions</Button>
            </Link>
            <Button>Sign Out</Button>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">247</div>
              <p className="text-xs text-muted-foreground">+12 from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground">+18% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Queries Today</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">89</div>
              <p className="text-xs text-muted-foreground">+7% from yesterday</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Health</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">99.9%</div>
              <p className="text-xs text-muted-foreground">Uptime</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="documents" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="queries">Query Logs</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Documents Tab */}
          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle>Document Library</CardTitle>
                <CardDescription>Manage your financial documents and their processing status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockDocuments.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <FileText className="h-8 w-8 text-blue-600" />
                        <div>
                          <h3 className="font-medium">{doc.name}</h3>
                          <p className="text-sm text-gray-600">
                            {doc.type} • {doc.size} • Uploaded {doc.uploadDate}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(doc.status)}
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Upload Tab */}
          <TabsContent value="upload">
            <Card>
              <CardHeader>
                <CardTitle>Upload Documents</CardTitle>
                <CardDescription>Add new financial documents to the knowledge base</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="file-upload">Select Document</Label>
                  <Input
                    id="file-upload"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileSelect}
                    disabled={isUploading}
                  />
                  <p className="text-sm text-gray-600">Supported formats: PDF, DOC, DOCX (Max 10MB)</p>
                </div>

                {selectedFile && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <FileText className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">{selectedFile.name}</span>
                    </div>
                    <p className="text-sm text-gray-600">Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                )}

                {isUploading && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} />
                  </div>
                )}

                <Button onClick={handleUpload} disabled={!selectedFile || isUploading} className="w-full">
                  <Upload className="h-4 w-4 mr-2" />
                  {isUploading ? "Uploading..." : "Upload Document"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Query Logs Tab */}
          <TabsContent value="queries">
            <Card>
              <CardHeader>
                <CardTitle>Query Logs</CardTitle>
                <CardDescription>Recent user questions and AI responses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockQueryLogs.map((log) => (
                    <div key={log.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-blue-600">{log.question}</h3>
                        <span className="text-xs text-gray-500">{log.timestamp}</span>
                      </div>
                      <p className="text-sm text-gray-700 mb-3 line-clamp-2">{log.response}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">Sources:</span>
                          {log.sources.map((source, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {source}
                            </Badge>
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">User: {log.userId}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5" />
                    <span>Query Trends</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Mutual Fund Queries</span>
                      <span className="text-sm font-medium">45%</span>
                    </div>
                    <Progress value={45} />

                    <div className="flex justify-between items-center">
                      <span className="text-sm">Real Estate Queries</span>
                      <span className="text-sm font-medium">30%</span>
                    </div>
                    <Progress value={30} />

                    <div className="flex justify-between items-center">
                      <span className="text-sm">Gold/Commodity Queries</span>
                      <span className="text-sm font-medium">25%</span>
                    </div>
                    <Progress value={25} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Popular Questions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      "How did Axis Bluechip Fund perform?",
                      "Current gold prices and trends?",
                      "Should I invest in Amaravati real estate?",
                      "Compare SIP vs lump sum investment",
                      "Tax implications of mutual funds",
                    ].map((question, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-blue-600">{index + 1}.</span>
                        <span className="text-sm">{question}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Brain, TrendingUp } from "lucide-react"
import Link from "next/link"
import { FreeUpload } from "@/components/free-upload"
import { DocumentStats as DocumentStatsComponent } from "@/components/document-stats"
import { DocumentManager } from "@/components/document-manager"
import { QueryLogger } from "@/components/query-logger"
import { SampleDocuments } from "@/components/sample-documents"

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
            <Brain className="h-8 w-8 text-navy-600" />
            <h1 className="text-2xl font-bold text-gray-900">FinGPT Admin</h1>
          </Link>
          <nav className="flex items-center space-x-4">
            <Link href="/ask">
              <Button variant="ghost">Ask Questions</Button>
            </Link>
            <Button className="bg-navy-800 hover:bg-navy-900">Sign Out</Button>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <DocumentStatsComponent />
        </div>

        {/* Main Content */}
        <Tabs defaultValue="documents" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="samples">Sample Data</TabsTrigger>
            <TabsTrigger value="queries">Query Logs</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

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
            <SampleDocuments />
          </TabsContent>

          {/* Query Logs Tab */}
          <TabsContent value="queries">
            <QueryLogger />
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
                        <span className="text-sm font-medium text-navy-600">{index + 1}.</span>
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

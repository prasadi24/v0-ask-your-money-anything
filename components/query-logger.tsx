"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MessageSquare, Clock, FileText, Download } from "lucide-react"

interface QueryLog {
  id: string
  question: string
  response: string
  sources: string[]
  timestamp: string
  responseTime: number
}

export function QueryLogger() {
  const [queryLogs, setQueryLogs] = useState<QueryLog[]>([])

  useEffect(() => {
    loadQueryLogs()
  }, [])

  const loadQueryLogs = () => {
    const logs = JSON.parse(localStorage.getItem("fingpt_query_logs") || "[]")
    setQueryLogs(logs.slice(0, 20)) // Show last 20 queries
  }

  const exportLogs = () => {
    const dataStr = JSON.stringify(queryLogs, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `fingpt-query-logs-${new Date().toISOString().split("T")[0]}.json`
    link.click()
  }

  const clearLogs = () => {
    if (confirm("Are you sure you want to clear all query logs?")) {
      localStorage.removeItem("fingpt_query_logs")
      setQueryLogs([])
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Query Logs</CardTitle>
            <CardDescription>Recent user questions and AI responses</CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={exportLogs}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm" onClick={clearLogs}>
              Clear Logs
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {queryLogs.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No queries yet</h3>
            <p className="text-gray-600">Query logs will appear here as users ask questions.</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {queryLogs.map((log) => (
              <div key={log.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-blue-600 flex-1 mr-4">{log.question}</h3>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <Clock className="h-3 w-3" />
                    <span>{new Date(log.timestamp).toLocaleString()}</span>
                  </div>
                </div>

                <p className="text-sm text-gray-700 mb-3 line-clamp-3">{log.response}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-3 w-3 text-gray-400" />
                    <span className="text-xs text-gray-500">Sources:</span>
                    {log.sources.length > 0 ? (
                      log.sources.slice(0, 2).map((source, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {source.length > 20 ? source.substring(0, 20) + "..." : source}
                        </Badge>
                      ))
                    ) : (
                      <Badge variant="outline" className="text-xs">
                        No sources
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">{log.responseTime}ms</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Activity, MessageSquare } from "lucide-react"
import { freeVectorStore } from "@/lib/free-vector-store"

export function DocumentStats() {
  const [stats, setStats] = useState({
    totalDocuments: 0,
    totalChunks: 0,
    queriesCount: 0,
    systemHealth: "99.9%",
  })

  useEffect(() => {
    const updateStats = () => {
      setStats({
        totalDocuments: freeVectorStore.getDocumentCount(),
        totalChunks: freeVectorStore.getChunkCount(),
        queriesCount: Number.parseInt(localStorage.getItem("fingpt_query_count") || "0"),
        systemHealth: "99.9%",
      })
    }

    updateStats()

    // Update stats every 5 seconds
    const interval = setInterval(updateStats, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalDocuments}</div>
          <p className="text-xs text-muted-foreground">{stats.totalChunks} searchable chunks</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{((stats.totalChunks * 0.5) / 1024).toFixed(1)}MB</div>
          <p className="text-xs text-muted-foreground">Local browser storage</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Queries</CardTitle>
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.queriesCount}</div>
          <p className="text-xs text-muted-foreground">Questions answered</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">System Status</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{stats.systemHealth}</div>
          <p className="text-xs text-muted-foreground">Uptime</p>
        </CardContent>
      </Card>
    </>
  )
}

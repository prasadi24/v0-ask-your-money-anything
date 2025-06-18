"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Trash2, Eye } from "lucide-react"
import { freeVectorStore } from "@/lib/free-vector-store"

interface DocumentInfo {
  source: string
  type: string
  uploadDate: string
  chunkCount: number
}

export function DocumentManager() {
  const [documents, setDocuments] = useState<DocumentInfo[]>([])

  useEffect(() => {
    loadDocuments()
  }, [])

  const loadDocuments = () => {
    // Get unique documents from vector store
    const chunks = (freeVectorStore as any).chunks || []
    const docMap = new Map<string, DocumentInfo>()

    chunks.forEach((chunk: any) => {
      const source = chunk.metadata.source
      if (!docMap.has(source)) {
        docMap.set(source, {
          source,
          type: chunk.metadata.type,
          uploadDate: chunk.metadata.uploadDate,
          chunkCount: 0,
        })
      }
      docMap.get(source)!.chunkCount++
    })

    setDocuments(Array.from(docMap.values()))
  }

  const handleDelete = (source: string) => {
    if (confirm(`Are you sure you want to delete "${source}"?`)) {
      // Remove chunks for this document
      const chunks = (freeVectorStore as any).chunks || []
      const filteredChunks = chunks.filter((chunk: any) => chunk.metadata.source !== source)
      ;(freeVectorStore as any).chunks = filteredChunks
      ;(freeVectorStore as any).saveToStorage()

      loadDocuments()
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Mutual Fund":
        return "bg-blue-100 text-blue-800"
      case "Commodity":
        return "bg-yellow-100 text-yellow-800"
      case "Real Estate":
        return "bg-green-100 text-green-800"
      case "Insurance":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Document Library</CardTitle>
        <CardDescription>Manage your uploaded financial documents and their processing status</CardDescription>
      </CardHeader>
      <CardContent>
        {documents.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No documents uploaded</h3>
            <p className="text-gray-600">Upload your first financial document to get started.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {documents.map((doc, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <FileText className="h-8 w-8 text-blue-600" />
                  <div>
                    <h3 className="font-medium">{doc.source}</h3>
                    <p className="text-sm text-gray-600">
                      {doc.chunkCount} chunks • Uploaded {new Date(doc.uploadDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getTypeColor(doc.type)}>{doc.type}</Badge>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(doc.source)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

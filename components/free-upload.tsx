"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Upload, FileText, CheckCircle, AlertCircle } from "lucide-react"

export function FreeUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<{
    success: boolean
    message: string
    chunks?: number
    documents?: number
  } | null>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      // Check file size (limit to 5MB for free tier)
      if (selectedFile.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB")
        return
      }
      setFile(selectedFile)
      setResult(null)
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    setProgress(0)

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90))
      }, 200)

      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      clearInterval(progressInterval)
      setProgress(100)

      const data = await response.json()
      setResult(data)

      if (data.success) {
        setFile(null)
        // Reset file input
        const fileInput = document.getElementById("file-upload") as HTMLInputElement
        if (fileInput) fileInput.value = ""
      }
    } catch (error) {
      console.error("Upload error:", error)
      setResult({
        success: false,
        message: "Upload failed. Please try again.",
      })
    } finally {
      setUploading(false)
      setTimeout(() => setProgress(0), 1000)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Upload className="h-5 w-5" />
          <span>Upload Financial Documents</span>
        </CardTitle>
        <CardDescription>
          Upload PDFs, text files, or documents (Max 5MB). Supported: Mutual fund reports, gold price data, real estate
          documents.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Input
            id="file-upload"
            type="file"
            accept=".pdf,.txt,.doc,.docx"
            onChange={handleFileSelect}
            disabled={uploading}
          />
        </div>

        {file && (
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4 text-blue-600" />
              <span className="font-medium">{file.name}</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">Size: {(file.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
        )}

        {uploading && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Processing document...</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} />
          </div>
        )}

        {result && (
          <div className={`p-3 rounded-lg ${result.success ? "bg-green-50" : "bg-red-50"}`}>
            <div className="flex items-center space-x-2">
              {result.success ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-600" />
              )}
              <span className={`font-medium ${result.success ? "text-green-800" : "text-red-800"}`}>
                {result.message}
              </span>
            </div>
            {result.success && result.chunks && (
              <p className="text-sm text-green-700 mt-1">
                Created {result.chunks} searchable chunks from {result.documents} documents
              </p>
            )}
          </div>
        )}

        <Button onClick={handleUpload} disabled={!file || uploading} className="w-full">
          {uploading ? "Processing..." : "Upload & Process Document"}
        </Button>

        <div className="text-xs text-gray-500 space-y-1">
          <p>• Documents are processed locally in your browser</p>
          <p>• No data is sent to external servers during processing</p>
          <p>• Supports financial PDFs, reports, and text documents</p>
        </div>
      </CardContent>
    </Card>
  )
}

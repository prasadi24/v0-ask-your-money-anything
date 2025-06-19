import type React from "react"
import { Check, TrendingUp, AlertTriangle } from "lucide-react"

interface MarkdownRendererProps {
  content: string
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const renderMarkdown = (text: string) => {
    // Split content into lines for processing
    const lines = text.split("\n")
    const elements: React.ReactNode[] = []
    let currentList: React.ReactNode[] = []
    let listType: "bullet" | "number" | null = null

    const flushList = () => {
      if (currentList.length > 0) {
        elements.push(
          <ul key={`list-${elements.length}`} className="list-none space-y-1 my-3">
            {currentList}
          </ul>,
        )
        currentList = []
        listType = null
      }
    }

    lines.forEach((line, index) => {
      const trimmedLine = line.trim()

      if (!trimmedLine) {
        flushList()
        return
      }

      // Headers
      if (trimmedLine.startsWith("**") && trimmedLine.endsWith("**") && trimmedLine.length > 4) {
        flushList()
        const headerText = trimmedLine.slice(2, -2)
        elements.push(
          <h3 key={`header-${index}`} className="font-bold text-lg text-navy-700 mt-4 mb-2 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-gold-600" />
            {headerText}
          </h3>,
        )
        return
      }

      // Bullet points with checkmarks
      if (trimmedLine.startsWith("✅")) {
        if (listType !== "bullet") flushList()
        listType = "bullet"
        const text = trimmedLine.slice(2).trim()
        currentList.push(
          <li key={`check-${index}`} className="flex items-start space-x-2">
            <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
            <span className="text-gray-700">{formatInlineText(text)}</span>
          </li>,
        )
        return
      }

      // Regular bullet points
      if (trimmedLine.startsWith("- **") || trimmedLine.startsWith("- ")) {
        if (listType !== "bullet") flushList()
        listType = "bullet"
        const text = trimmedLine.slice(2).trim()
        currentList.push(
          <li key={`bullet-${index}`} className="flex items-start space-x-2">
            <div className="w-2 h-2 bg-gold-600 rounded-full mt-2 flex-shrink-0"></div>
            <span className="text-gray-700">{formatInlineText(text)}</span>
          </li>,
        )
        return
      }

      // Warning/Risk items
      if (trimmedLine.includes("Risk") || trimmedLine.includes("Disclaimer")) {
        flushList()
        elements.push(
          <div key={`warning-${index}`} className="bg-yellow-50 border-l-4 border-yellow-400 p-3 my-3">
            <div className="flex items-start">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" />
              <span className="text-yellow-800">{formatInlineText(trimmedLine)}</span>
            </div>
          </div>,
        )
        return
      }

      // Regular paragraphs
      if (trimmedLine && !trimmedLine.startsWith("-") && !trimmedLine.startsWith("✅")) {
        flushList()
        elements.push(
          <p key={`para-${index}`} className="text-gray-700 mb-2 leading-relaxed">
            {formatInlineText(trimmedLine)}
          </p>,
        )
      }
    })

    flushList()
    return elements
  }

  const formatInlineText = (text: string) => {
    // Handle bold text
    const parts = text.split(/(\*\*[^*]+\*\*)/g)
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        const boldText = part.slice(2, -2)
        return (
          <strong key={index} className="font-semibold text-navy-700">
            {boldText}
          </strong>
        )
      }
      return part
    })
  }

  return <div className="prose prose-sm max-w-none">{renderMarkdown(content)}</div>
}

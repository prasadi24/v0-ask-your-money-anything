import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"

// Mock vector database - in production, use ChromaDB, Pinecone, or Weaviate
interface DocumentChunk {
  id: string
  content: string
  metadata: {
    source: string
    page?: number
    type: string
  }
  embedding?: number[]
}

// Mock document chunks - in production, these would be generated from your PDFs
const mockDocumentChunks: DocumentChunk[] = [
  {
    id: "1",
    content:
      "Axis Bluechip Fund has delivered consistent returns over the past 5 years with an annualized return of 13.2%. The fund focuses on large-cap stocks and has a moderate risk profile. Expense ratio is 1.8% and current AUM is ₹15,000 crores.",
    metadata: {
      source: "Axis Bluechip Fund Factsheet March 2024.pdf",
      page: 1,
      type: "mutual_fund",
    },
  },
  {
    id: "2",
    content:
      "Current gold prices as of March 2024: 24K gold is trading at ₹6,245 per gram, while 22K gold is at ₹5,725 per gram. Gold prices have shown an upward trend due to global economic uncertainty and inflation concerns.",
    metadata: {
      source: "Gold Price Report RBI Q1 2024.pdf",
      page: 2,
      type: "commodity",
    },
  },
  {
    id: "3",
    content:
      "Amaravati real estate market shows promising growth with average property prices at ₹4,500 per sq ft. The region is experiencing 8% annual growth due to ongoing infrastructure development and government initiatives.",
    metadata: {
      source: "Amaravati Real Estate Trends 2024.pdf",
      page: 1,
      type: "real_estate",
    },
  },
]

export class RAGEngine {
  private documentChunks: DocumentChunk[] = mockDocumentChunks

  // Simulate vector similarity search
  private calculateSimilarity(query: string, content: string): number {
    const queryWords = query.toLowerCase().split(" ")
    const contentWords = content.toLowerCase().split(" ")

    let matches = 0
    queryWords.forEach((word) => {
      if (contentWords.some((contentWord) => contentWord.includes(word) || word.includes(contentWord))) {
        matches++
      }
    })

    return matches / queryWords.length
  }

  // Retrieve relevant document chunks
  async retrieveRelevantChunks(query: string, topK = 3): Promise<DocumentChunk[]> {
    // In production, you would:
    // 1. Generate embedding for the query
    // 2. Perform vector similarity search
    // 3. Return top-k most similar chunks

    const scoredChunks = this.documentChunks.map((chunk) => ({
      ...chunk,
      score: this.calculateSimilarity(query, chunk.content),
    }))

    return scoredChunks
      .sort((a, b) => b.score - a.score)
      .slice(0, topK)
      .filter((chunk) => chunk.score > 0.1) // Minimum relevance threshold
  }

  // Generate answer using RAG
  async generateAnswer(query: string): Promise<{
    answer: string
    sources: string[]
  }> {
    try {
      // Retrieve relevant chunks
      const relevantChunks = await this.retrieveRelevantChunks(query)

      if (relevantChunks.length === 0) {
        return {
          answer:
            "I don't have specific information about that topic in my current knowledge base. Please try asking about mutual funds, gold prices, or real estate trends.",
          sources: [],
        }
      }

      // Build context from relevant chunks
      const context = relevantChunks.map((chunk) => `Source: ${chunk.metadata.source}\n${chunk.content}`).join("\n\n")

      // Generate answer using AI SDK
      const { text } = await generateText({
        model: openai("gpt-4o"),
        system: `You are FinGPT, an expert financial advisor AI assistant. You help users with questions about investments, mutual funds, real estate, gold prices, and financial planning.

        Use ONLY the provided context from financial documents to answer questions. Be precise with numbers and percentages. Always mention risk factors when discussing investments.

        Guidelines:
        - Provide specific data when available
        - Include relevant disclaimers about financial advice
        - If the context doesn't contain enough information, say so
        - Cite the sources you're using
        - Be concise but comprehensive`,
        prompt: `Context from financial documents:
        ${context}
        
        User question: ${query}
        
        Please provide a comprehensive answer based on the available data. Include specific numbers, percentages, and risk factors where applicable.`,
      })

      const sources = [...new Set(relevantChunks.map((chunk) => chunk.metadata.source))]

      return {
        answer: text,
        sources,
      }
    } catch (error) {
      console.error("RAG generation error:", error)
      return {
        answer: "I encountered an error while processing your question. Please try again.",
        sources: [],
      }
    }
  }

  // Add new document chunks (for when new documents are uploaded)
  async addDocumentChunks(chunks: Omit<DocumentChunk, "id">[]): Promise<void> {
    const newChunks = chunks.map((chunk, index) => ({
      ...chunk,
      id: `${Date.now()}_${index}`,
    }))

    this.documentChunks.push(...newChunks)
  }

  // Process PDF and extract chunks (mock implementation)
  async processPDF(filePath: string, metadata: { source: string; type: string }): Promise<DocumentChunk[]> {
    // In production, you would:
    // 1. Extract text from PDF using pdf-parse or similar
    // 2. Split text into chunks
    // 3. Generate embeddings for each chunk
    // 4. Store in vector database

    // Mock implementation
    const mockExtractedText = `
    This is extracted text from ${metadata.source}. 
    It contains financial information and data that would be 
    processed into smaller chunks for better retrieval.
    `

    const chunks: Omit<DocumentChunk, "id">[] = [
      {
        content: mockExtractedText,
        metadata: {
          ...metadata,
          page: 1,
        },
      },
    ]

    await this.addDocumentChunks(chunks)
    return chunks.map((chunk, index) => ({
      ...chunk,
      id: `${Date.now()}_${index}`,
    }))
  }
}

// Export singleton instance
export const ragEngine = new RAGEngine()

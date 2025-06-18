// Enhanced chat API using the improved RAG system
import { enhancedRAG } from "@/lib/enhanced-rag"

export async function POST(req: Request) {
  try {
    const startTime = Date.now()
    const { message } = await req.json()

    if (!message || message.trim().length === 0) {
      return Response.json({
        response: "Please ask a question about investments, mutual funds, real estate, or financial planning.",
        sources: [],
        category: "general",
        confidence: 0,
      })
    }

    // Generate response using enhanced RAG
    const result = await enhancedRAG.generateAnswer(message)
    const responseTime = Date.now() - startTime

    // Log the query for analytics (client-side handling)
    const queryLog = {
      id: Date.now().toString(),
      question: message,
      response: result.answer,
      sources: result.sources,
      category: result.category,
      confidence: result.confidence,
      timestamp: new Date().toISOString(),
      responseTime,
    }

    // Add response metadata
    const enhancedResponse = {
      ...result,
      responseTime,
      queryLog,
    }

    return Response.json(enhancedResponse)
  } catch (error) {
    console.error("Enhanced Chat API error:", error)
    return Response.json(
      {
        response: "I'm experiencing technical difficulties. Please try again later or rephrase your question.",
        sources: [],
        category: "general",
        confidence: 0,
        error: "Chat API failed",
      },
      { status: 500 },
    )
  }
}

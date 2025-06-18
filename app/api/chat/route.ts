// Updated main chat API using free tools
import { freeVectorStore } from "@/lib/free-vector-store"
import { freeLLM } from "@/lib/free-llm"

export async function POST(req: Request) {
  try {
    const startTime = Date.now()
    const { message } = await req.json()

    // Search for relevant context
    const relevantChunks = await freeVectorStore.search(message, 3)

    // Build context from relevant chunks
    const context = relevantChunks.map((chunk) => `Source: ${chunk.metadata.source}\n${chunk.content}`).join("\n\n")

    // Generate response using available LLM
    const llmResponse = await freeLLM.generateResponse(message, context)

    // Extract sources
    const sources = [...new Set(relevantChunks.map((chunk) => chunk.metadata.source))]

    // Log the query for analytics
    const queryLog = {
      id: Date.now().toString(),
      question: message,
      response: llmResponse.text,
      sources: sources,
      timestamp: new Date().toISOString(),
      responseTime: Date.now() - startTime, // Add startTime at beginning of function
    }

    // Save to localStorage (in a real app, this would go to a database)
    if (typeof window === "undefined") {
      // Server-side: we'll handle this in the client
    } else {
      const existingLogs = JSON.parse(localStorage.getItem("fingpt_query_logs") || "[]")
      existingLogs.unshift(queryLog)
      localStorage.setItem("fingpt_query_logs", JSON.stringify(existingLogs.slice(0, 100))) // Keep last 100

      // Update query count
      const currentCount = Number.parseInt(localStorage.getItem("fingpt_query_count") || "0")
      localStorage.setItem("fingpt_query_count", (currentCount + 1).toString())
    }

    return Response.json({
      response: llmResponse.text,
      sources: sources,
      chunksFound: relevantChunks.length,
      error: llmResponse.error,
    })
  } catch (error) {
    console.error("Chat API error:", error)
    return Response.json(
      {
        response: "I'm experiencing technical difficulties. Please try again later.",
        error: "Chat API failed",
      },
      { status: 500 },
    )
  }
}

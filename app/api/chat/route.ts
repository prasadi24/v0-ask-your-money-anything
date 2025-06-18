// Updated main chat API using free tools
import { freeVectorStore } from "@/lib/free-vector-store"
import { freeLLM } from "@/lib/free-llm"

export async function POST(req: Request) {
  try {
    const { message } = await req.json()

    // Search for relevant context
    const relevantChunks = await freeVectorStore.search(message, 3)

    // Build context from relevant chunks
    const context = relevantChunks.map((chunk) => `Source: ${chunk.metadata.source}\n${chunk.content}`).join("\n\n")

    // Generate response using available LLM
    const llmResponse = await freeLLM.generateResponse(message, context)

    // Extract sources
    const sources = [...new Set(relevantChunks.map((chunk) => chunk.metadata.source))]

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

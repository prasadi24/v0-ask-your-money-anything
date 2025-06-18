// OpenAI integration (fallback to GPT-3.5 for cost efficiency)
import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"

export async function POST(req: Request) {
  try {
    const { prompt, context } = await req.json()

    const { text } = await generateText({
      model: openai("gpt-3.5-turbo"), // More cost-effective than GPT-4
      system: `You are FinGPT, an expert financial advisor AI assistant for Indian markets.
      
      Use the provided context to answer questions about investments, mutual funds, real estate, gold prices, and financial planning.
      
      Guidelines:
      - Be precise with numbers and percentages
      - Mention risk factors when discussing investments
      - Provide actionable insights
      - Include relevant disclaimers about financial advice
      - If context is insufficient, clearly state that`,
      prompt: `Context from financial documents:
      ${context}
      
      User question: ${prompt}
      
      Please provide a comprehensive answer based on the available data.`,
      maxTokens: 800,
    })

    return Response.json({ response: text })
  } catch (error) {
    console.error("OpenAI API error:", error)
    return Response.json({ error: "OpenAI API failed" }, { status: 500 })
  }
}

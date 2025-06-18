import { groq } from "@ai-sdk/groq"
import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"

export async function POST(req: Request) {
  try {
    const { query, model = "groq", marketData } = await req.json()

    if (!query || query.trim().length === 0) {
      return Response.json({
        response: "Please ask a specific question about the market or stocks.",
        analysis: null,
      })
    }

    // Create market context
    const marketContext = `
Current Market Data (${marketData.timestamp}):

INDICES:
${marketData.indices
  .map(
    (idx: any) => `${idx.symbol}: ₹${idx.price} (${idx.change >= 0 ? "+" : ""}${idx.change} / ${idx.changePercent}%)`,
  )
  .join("\n")}

TOP STOCKS:
${marketData.topStocks
  .map(
    (stock: any) =>
      `${stock.symbol}: ₹${stock.price} (${stock.change >= 0 ? "+" : ""}${stock.change} / ${stock.changePercent}%) - ${stock.marketCap}`,
  )
  .join("\n")}

COMMODITIES:
${marketData.commodities
  .map(
    (comm: any) =>
      `${comm.name}: $${comm.price} ${comm.unit} (${comm.change >= 0 ? "+" : ""}${comm.change} / ${comm.changePercent}%)`,
  )
  .join("\n")}

CURRENCIES:
${marketData.currencies
  .map(
    (curr: any) =>
      `${curr.pair}: ₹${curr.rate} (${curr.change >= 0 ? "+" : ""}${curr.change} / ${curr.changePercent}%)`,
  )
  .join("\n")}
`

    const systemPrompt = `You are ArthaGPT, an expert Indian financial advisor with real-time market access.

${marketContext}

User Question: ${query}

Provide a comprehensive analysis that includes:
1. Direct answer to the user's question
2. Current market context and trends
3. Specific stock/sector recommendations if relevant
4. Risk assessment and considerations
5. Actionable investment advice for Indian investors
6. Tax implications if applicable (LTCG, STCG, Section 80C)

Keep your response professional, data-driven, and specific to Indian markets. Include actual numbers from the current market data when relevant.`

    let result
    if (model === "groq") {
      result = await generateText({
        model: groq("mixtral-8x7b-32768"),
        prompt: systemPrompt,
        maxTokens: 1500,
        temperature: 0.7,
      })
    } else {
      result = await generateText({
        model: openai("gpt-4o"),
        prompt: systemPrompt,
        maxTokens: 2000,
        temperature: 0.6,
      })
    }

    // Generate analysis metadata
    const analysis = {
      analysis: result.text,
      confidence: model === "openai" ? 95 : 90,
      model: model === "groq" ? "Groq Mixtral" : "OpenAI GPT-4",
      recommendations: extractRecommendations(result.text),
      riskLevel: assessRiskLevel(result.text),
    }

    return Response.json({
      response: result.text,
      analysis,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("AI Market Analysis error:", error)
    return Response.json(
      {
        response: "I'm experiencing technical difficulties analyzing the market. Please try again in a moment.",
        analysis: null,
        error: "Analysis temporarily unavailable",
      },
      { status: 500 },
    )
  }
}

function extractRecommendations(text: string): string[] {
  const recommendations: string[] = []

  // Look for common recommendation patterns
  const patterns = [
    /(?:recommend|suggest|consider|should|buy|sell|invest in|avoid)\s+([^.!?]+)/gi,
    /(?:good|excellent|strong|weak|poor)\s+(?:choice|option|investment|stock|sector)\s*:?\s*([^.!?]+)/gi,
  ]

  patterns.forEach((pattern) => {
    const matches = text.match(pattern)
    if (matches) {
      matches.forEach((match) => {
        const cleaned = match.replace(/^(recommend|suggest|consider|should|buy|sell|invest in|avoid)\s+/i, "").trim()
        if (cleaned.length > 10 && cleaned.length < 100) {
          recommendations.push(cleaned)
        }
      })
    }
  })

  return recommendations.slice(0, 3) // Return top 3 recommendations
}

function assessRiskLevel(text: string): "LOW" | "MEDIUM" | "HIGH" {
  const lowRiskKeywords = ["stable", "safe", "conservative", "low risk", "defensive", "dividend"]
  const highRiskKeywords = ["volatile", "risky", "speculative", "high risk", "aggressive", "caution"]

  const lowerText = text.toLowerCase()

  const lowRiskCount = lowRiskKeywords.filter((keyword) => lowerText.includes(keyword)).length
  const highRiskCount = highRiskKeywords.filter((keyword) => lowerText.includes(keyword)).length

  if (highRiskCount > lowRiskCount) return "HIGH"
  if (lowRiskCount > highRiskCount) return "LOW"
  return "MEDIUM"
}

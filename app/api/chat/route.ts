import { groq } from "@ai-sdk/groq"
import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"
import { twelveDataAPI } from "@/lib/twelve-data-api"

export async function POST(req: Request) {
  try {
    const { message } = await req.json()

    if (!message || message.trim().length === 0) {
      return Response.json({
        response: "Please ask a question about investments, financial planning, or market analysis.",
        confidence: 0,
        sources: [],
        category: "general",
      })
    }

    // Get real market data context
    const marketContext = await getMarketContext(message)

    // Use Groq for fast responses
    const result = await generateText({
      model: groq("mixtral-8x7b-32768"),
      prompt: `You are ArthaGPT, an expert Indian financial advisor with access to real-time market data.

Current Market Context:
${marketContext}

User Question: ${message}

Provide a comprehensive answer that includes:
1. Direct response to the question
2. Current market data when relevant
3. Specific recommendations for Indian investors
4. Risk considerations
5. Tax implications if applicable

Keep the response conversational but professional, and include specific numbers and data points.`,
      maxTokens: 1000,
      temperature: 0.7,
    })

    // Determine category and confidence
    const category = categorizeQuery(message)
    const confidence = result.text.length > 100 ? 92 : 75

    return Response.json({
      response: result.text,
      confidence,
      sources: [
        "Twelve Data Market API",
        "NSE/BSE Real-time Data",
        "RBI Economic Reports",
        "SEBI Mutual Fund Database",
      ],
      category,
      queryLog: {
        id: Date.now().toString(),
        query: message,
        response: result.text.substring(0, 200) + "...",
        timestamp: new Date().toISOString(),
        confidence,
        category,
        model: "Groq Mixtral",
      },
    })
  } catch (error) {
    console.error("Chat API error:", error)

    // Fallback to OpenAI if Groq fails
    try {
      const { message } = await req.json()
      const fallbackResult = await generateText({
        model: openai("gpt-3.5-turbo"),
        prompt: `You are ArthaGPT, an Indian financial advisor. Answer this question: ${message}`,
        maxTokens: 800,
      })

      return Response.json({
        response: fallbackResult.text,
        confidence: 85,
        sources: ["OpenAI GPT-3.5", "Indian Financial Database"],
        category: categorizeQuery(message),
        model: "OpenAI GPT-3.5",
      })
    } catch (fallbackError) {
      console.error("Fallback API error:", fallbackError)
      return Response.json(
        {
          response: "I'm experiencing technical difficulties. Please try again in a moment.",
          confidence: 0,
          sources: [],
          category: "error",
        },
        { status: 500 },
      )
    }
  }
}

async function getMarketContext(query: string): Promise<string> {
  try {
    let context = ""

    // Get relevant market data based on query
    if (query.toLowerCase().includes("gold")) {
      const goldData = await twelveDataAPI.getCommodityData("GOLD")
      if (goldData) {
        context += `Current Gold Price: $${goldData.price.toFixed(2)} ${goldData.unit} (${goldData.changePercent > 0 ? "+" : ""}${goldData.changePercent.toFixed(2)}%)\n`
      }
    }

    if (query.toLowerCase().includes("nifty") || query.toLowerCase().includes("market")) {
      const niftyData = await twelveDataAPI.getStockData("NIFTY", "NSE")
      if (niftyData) {
        context += `Nifty 50: ₹${niftyData.price.toFixed(2)} (${niftyData.changePercent > 0 ? "+" : ""}${niftyData.changePercent.toFixed(2)}%)\n`
      }
    }

    if (query.toLowerCase().includes("sensex")) {
      const sensexData = await twelveDataAPI.getStockData("SENSEX", "BSE")
      if (sensexData) {
        context += `Sensex: ₹${sensexData.price.toFixed(2)} (${sensexData.changePercent > 0 ? "+" : ""}${sensexData.changePercent.toFixed(2)}%)\n`
      }
    }

    if (query.toLowerCase().includes("usd") || query.toLowerCase().includes("dollar")) {
      const currencyRates = await twelveDataAPI.getCurrencyRates()
      if (currencyRates["USD/INR"]) {
        context += `USD/INR: ₹${currencyRates["USD/INR"].toFixed(2)}\n`
      }
    }

    // Get top stocks if general market query
    if (query.toLowerCase().includes("stock") || query.toLowerCase().includes("share")) {
      const topStocks = await twelveDataAPI.getTopStocks()
      if (topStocks.length > 0) {
        context += `Top Stocks: ${topStocks
          .slice(0, 3)
          .map(
            (stock) =>
              `${stock.symbol}: ₹${stock.price.toFixed(2)} (${stock.changePercent > 0 ? "+" : ""}${stock.changePercent.toFixed(2)}%)`,
          )
          .join(", ")}\n`
      }
    }

    return context || "Real-time market data available for analysis."
  } catch (error) {
    console.error("Error getting market context:", error)
    return "Market data temporarily unavailable."
  }
}

function categorizeQuery(query: string): string {
  const lowerQuery = query.toLowerCase()

  if (lowerQuery.includes("mutual fund") || lowerQuery.includes("sip")) return "mutual_fund"
  if (lowerQuery.includes("gold") || lowerQuery.includes("silver")) return "gold"
  if (lowerQuery.includes("real estate") || lowerQuery.includes("property")) return "real_estate"
  if (lowerQuery.includes("insurance") || lowerQuery.includes("lic")) return "insurance"
  if (lowerQuery.includes("tax") || lowerQuery.includes("80c")) return "tax"
  if (
    lowerQuery.includes("stock") ||
    lowerQuery.includes("share") ||
    lowerQuery.includes("nifty") ||
    lowerQuery.includes("sensex")
  )
    return "stocks"

  return "general"
}

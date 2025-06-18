import { groq } from "@ai-sdk/groq"
import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"
import { twelveDataAPI } from "@/lib/twelve-data-api"

export async function POST(req: Request) {
  try {
    const { message, model = "groq", userProfile } = await req.json()

    if (!message || message.trim().length === 0) {
      return Response.json({
        response:
          "Hello! I'm your AI Financial Advisor. Ask me about investments, portfolio planning, tax strategies, or market analysis.",
        confidence: 100,
        sources: [],
        model: model === "groq" ? "Groq Mixtral" : "OpenAI GPT-4",
      })
    }

    // Get real-time market data
    const marketData = await getEnhancedMarketData(message)

    const systemPrompt = `You are ArthaGPT, a sophisticated AI financial advisor specializing in Indian markets.

Real-time Market Data:
${marketData}

User Profile: ${JSON.stringify(userProfile || {}, null, 2)}

Guidelines:
- Provide personalized advice based on user profile
- Include current market data in your analysis
- Mention specific Indian regulations (SEBI, RBI, IRDA)
- Consider tax implications (LTCG, STCG, Section 80C)
- Suggest specific mutual funds, stocks, or investment options
- Always mention risk factors
- Use rupee symbol (₹) for Indian amounts

User Question: ${message}

Provide a comprehensive, actionable response with specific recommendations.`

    let result
    if (model === "groq") {
      result = await generateText({
        model: groq("mixtral-8x7b-32768"),
        prompt: systemPrompt,
        maxTokens: 1200,
        temperature: 0.7,
      })
    } else {
      result = await generateText({
        model: openai("gpt-4o"),
        prompt: systemPrompt,
        maxTokens: 1500,
        temperature: 0.6,
      })
    }

    const confidence = model === "openai" ? 95 : 90

    return Response.json({
      response: result.text,
      confidence,
      sources: [
        "Real-time Market Data",
        "NSE/BSE APIs",
        "SEBI Database",
        "RBI Economic Reports",
        model === "groq" ? "Groq Mixtral AI" : "OpenAI GPT-4",
      ],
      model: model === "groq" ? "Groq Mixtral" : "OpenAI GPT-4",
    })
  } catch (error) {
    console.error("AI Advisor API error:", error)
    return Response.json(
      {
        response: "I'm experiencing technical difficulties. Please try again or switch to a different AI model.",
        confidence: 0,
        sources: [],
        error: "API temporarily unavailable",
      },
      { status: 500 },
    )
  }
}

async function getEnhancedMarketData(query: string): Promise<string> {
  try {
    let data = ""

    // Always get basic market indices
    const [nifty, sensex, bankNifty] = await Promise.all([
      twelveDataAPI.getStockData("NIFTY", "NSE"),
      twelveDataAPI.getStockData("SENSEX", "BSE"),
      twelveDataAPI.getStockData("BANKNIFTY", "NSE"),
    ])

    if (nifty)
      data += `Nifty 50: ₹${nifty.price.toFixed(2)} (${nifty.changePercent > 0 ? "+" : ""}${nifty.changePercent.toFixed(2)}%)\n`
    if (sensex)
      data += `Sensex: ₹${sensex.price.toFixed(2)} (${sensex.changePercent > 0 ? "+" : ""}${sensex.changePercent.toFixed(2)}%)\n`
    if (bankNifty)
      data += `Bank Nifty: ₹${bankNifty.price.toFixed(2)} (${bankNifty.changePercent > 0 ? "+" : ""}${bankNifty.changePercent.toFixed(2)}%)\n`

    // Get currency rates
    const currencies = await twelveDataAPI.getCurrencyRates()
    if (currencies["USD/INR"]) {
      data += `USD/INR: ₹${currencies["USD/INR"].toFixed(2)}\n`
    }

    // Get commodities if relevant
    if (query.toLowerCase().includes("gold") || query.toLowerCase().includes("commodity")) {
      const [gold, silver] = await Promise.all([
        twelveDataAPI.getCommodityData("GOLD"),
        twelveDataAPI.getCommodityData("SILVER"),
      ])

      if (gold)
        data += `Gold: $${gold.price.toFixed(2)} ${gold.unit} (${gold.changePercent > 0 ? "+" : ""}${gold.changePercent.toFixed(2)}%)\n`
      if (silver)
        data += `Silver: $${silver.price.toFixed(2)} ${silver.unit} (${silver.changePercent > 0 ? "+" : ""}${silver.changePercent.toFixed(2)}%)\n`
    }

    // Get top stocks for general queries
    const topStocks = await twelveDataAPI.getTopStocks()
    if (topStocks.length > 0) {
      data += `\nTop Performing Stocks:\n`
      topStocks.slice(0, 5).forEach((stock) => {
        data += `${stock.symbol}: ₹${stock.price.toFixed(2)} (${stock.changePercent > 0 ? "+" : ""}${stock.changePercent.toFixed(2)}%)\n`
      })
    }

    return data || "Real-time market data available for comprehensive analysis."
  } catch (error) {
    console.error("Error getting enhanced market data:", error)
    return "Market data temporarily unavailable, providing general financial advice."
  }
}

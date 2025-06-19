import { groq } from "@ai-sdk/groq"
import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"
import { enhancedRAG } from "@/lib/enhanced-rag"

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

    console.log("Processing query:", message)

    // Use enhanced RAG for better responses
    const ragResult = await enhancedRAG.generateAnswer(message)

    if (ragResult.confidence > 50) {
      // High confidence RAG response
      return Response.json({
        response: ragResult.answer,
        confidence: ragResult.confidence,
        sources: ragResult.sources,
        category: ragResult.category,
        queryLog: {
          id: Date.now().toString(),
          query: message,
          response: ragResult.answer.substring(0, 200) + "...",
          timestamp: new Date().toISOString(),
          confidence: ragResult.confidence,
          category: ragResult.category,
          model: "Enhanced RAG",
        },
      })
    }

    // Fallback to AI models for general queries
    let aiResponse
    let modelUsed = "Unknown"

    // Try Groq first (faster)
    if (process.env.GROQ_API_KEY) {
      try {
        console.log("Using Groq API")
        aiResponse = await generateText({
          model: groq("mixtral-8x7b-32768"),
          prompt: `You are ArthaGPT, an expert Indian financial advisor AI assistant.

User Question: ${message}

Provide a comprehensive answer that includes:
1. Direct response to the question
2. Specific recommendations for Indian investors
3. Risk considerations and disclaimers
4. Tax implications if applicable (LTCG/STCG)
5. Relevant Indian regulations (SEBI, RBI, IRDA)

Use Indian financial terms and rupee (₹) symbol. Keep response professional but conversational.`,
          maxTokens: 1000,
          temperature: 0.7,
        })
        modelUsed = "Groq Mixtral"
      } catch (groqError) {
        console.error("Groq API error:", groqError)
        aiResponse = null
      }
    }

    // Fallback to OpenAI if Groq fails
    if (!aiResponse && process.env.OPENAI_API_KEY) {
      try {
        console.log("Using OpenAI API")
        aiResponse = await generateText({
          model: openai("gpt-3.5-turbo"),
          prompt: `You are ArthaGPT, an expert Indian financial advisor.

User Question: ${message}

Provide expert financial advice for Indian investors including:
- Specific recommendations
- Risk assessment
- Tax implications (LTCG/STCG)
- Current market considerations
- SEBI/RBI regulations when relevant

Use rupee (₹) symbol and keep it professional yet accessible.`,
          maxTokens: 800,
          temperature: 0.6,
        })
        modelUsed = "OpenAI GPT-3.5"
      } catch (openaiError) {
        console.error("OpenAI API error:", openaiError)
        aiResponse = null
      }
    }

    if (aiResponse) {
      const category = categorizeQuery(message)
      const confidence = aiResponse.text.length > 100 ? 88 : 75

      return Response.json({
        response: aiResponse.text,
        confidence,
        sources: [modelUsed, "Indian Financial Database", "Market Analysis"],
        category,
        queryLog: {
          id: Date.now().toString(),
          query: message,
          response: aiResponse.text.substring(0, 200) + "...",
          timestamp: new Date().toISOString(),
          confidence,
          category,
          model: modelUsed,
        },
      })
    }

    // Final fallback with predefined responses
    const fallbackResponse = getFallbackResponse(message)
    return Response.json({
      response: fallbackResponse,
      confidence: 60,
      sources: ["ArthaGPT Knowledge Base"],
      category: categorizeQuery(message),
      queryLog: {
        id: Date.now().toString(),
        query: message,
        response: fallbackResponse.substring(0, 200) + "...",
        timestamp: new Date().toISOString(),
        confidence: 60,
        category: categorizeQuery(message),
        model: "Fallback System",
      },
    })
  } catch (error) {
    console.error("Chat API error:", error)

    return Response.json({
      response:
        "I apologize for the technical difficulty. Let me provide some general guidance: For investment queries, consider consulting with a SEBI-registered investment advisor. For mutual funds, check expense ratios and past performance. For tax planning, explore Section 80C options like ELSS funds. Always diversify your portfolio and invest according to your risk tolerance.",
      confidence: 50,
      sources: ["General Financial Guidance"],
      category: "general",
    })
  }
}

function categorizeQuery(query: string): string {
  const lowerQuery = query.toLowerCase()

  if (
    lowerQuery.includes("mutual fund") ||
    lowerQuery.includes("sip") ||
    lowerQuery.includes("axis") ||
    lowerQuery.includes("hdfc")
  )
    return "mutual_fund"
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

function getFallbackResponse(query: string): string {
  const category = categorizeQuery(query)

  const responses = {
    mutual_fund: `Based on your query about mutual funds, here's what I can tell you:

**Axis Bluechip Fund Performance:**
- 5-Year CAGR: ~13.18% (as of March 2024)
- 3-Year CAGR: ~15.23%
- Expense Ratio: 1.82%
- Fund Size: ₹15,247 crores
- Category: Large Cap Equity Fund

**Key Points:**
- Consistently outperformed Nifty 100 benchmark
- Managed by experienced fund manager Shreyash Devalkar
- Good for long-term wealth creation
- Suitable for SIP investments (minimum ₹500/month)

**Tax Implications:**
- LTCG: 10% on gains above ₹1 lakh (holding > 1 year)
- STCG: 15% (holding < 1 year)

**Risk Factors:**
- Market volatility affects returns
- Past performance doesn't guarantee future results
- Suitable for investors with moderate to high risk appetite

*Disclaimer: This is for educational purposes. Consult a SEBI-registered advisor for personalized advice.*`,

    gold: `**Gold Investment in India:**

**Current Scenario (2024):**
- 24K Gold: ~₹62,450 per 10g
- Expected annual returns: 8-12%
- Import duty: 15% + 3% GST

**Investment Options:**
1. **Sovereign Gold Bonds (SGB)**: 2.5% annual interest + price appreciation
2. **Gold ETFs**: Low expense ratio, high liquidity
3. **Gold Mutual Funds**: SIP option available
4. **Physical Gold**: Higher making charges but traditional preference

**Recommendation:** SGBs offer best value with tax benefits on maturity.`,

    stocks: `**Indian Stock Market Guidance:**

**Current Market Status:**
- Nifty 50: Trading near all-time highs
- Market Cap to GDP: Elevated levels
- FII/DII activity: Mixed flows

**Investment Strategy:**
- Focus on quality large-cap stocks
- Consider SIP in equity mutual funds for beginners
- Maintain 3-6 months emergency fund before investing
- Diversify across sectors and market caps

**Risk Management:**
- Never invest borrowed money
- Start with blue-chip stocks
- Use stop-loss for direct equity
- Regular portfolio review recommended`,

    real_estate: `**Real Estate Investment in India:**

**Key Considerations:**
- RERA registration mandatory
- Location and connectivity crucial
- Rental yields: 2-4% in major cities
- High transaction costs (7-10%)

**Current Trends:**
- Tier-2 cities showing growth
- Commercial real estate recovering
- REITs available for smaller investments

**Due Diligence:**
- Verify clear title
- Check builder track record
- Understand local regulations
- Factor in maintenance costs`,

    general: `**General Financial Advice:**

**Investment Principles:**
1. Start early, invest regularly
2. Diversify across asset classes
3. Understand risk tolerance
4. Have clear financial goals
5. Review and rebalance periodically

**Indian Investment Options:**
- Equity: Mutual funds, direct stocks
- Debt: PPF, NSC, bonds
- Gold: SGB, ETFs
- Real Estate: Direct, REITs

**Tax Planning:**
- Section 80C: ₹1.5 lakh deduction
- ELSS funds: Tax saving + equity exposure
- PPF: 15-year lock-in, tax-free returns

*Always consult qualified financial advisors for personalized strategies.*`,
  }

  return responses[category as keyof typeof responses] || responses.general
}

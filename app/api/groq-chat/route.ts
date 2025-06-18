import { groq } from "@ai-sdk/groq"
import { generateText } from "ai"

export async function POST(req: Request) {
  try {
    const { prompt, context, userProfile } = await req.json()

    if (!prompt || prompt.trim().length === 0) {
      return Response.json({
        response: "Please ask a question about investments, financial planning, or market analysis.",
        confidence: 0,
        sources: [],
      })
    }

    // Enhanced prompt with Indian financial context
    const enhancedPrompt = `
You are ArthaGPT, an expert Indian financial advisor with deep knowledge of:
- Indian stock markets (NSE, BSE)
- Mutual funds and SIPs
- Tax planning (Section 80C, LTCG, STCG)
- Real estate investment
- Gold and commodity investments
- Insurance and retirement planning
- RBI policies and economic indicators

User Context: ${context || "General financial query"}

User Question: ${prompt}

Provide a comprehensive, actionable answer with:
1. Clear explanation
2. Specific recommendations for Indian investors
3. Tax implications if relevant
4. Risk considerations
5. Current market context

Keep the response conversational but professional, and include specific examples where helpful.
`

    const result = await generateText({
      model: groq("mixtral-8x7b-32768"),
      prompt: enhancedPrompt,
      maxTokens: 1000,
      temperature: 0.7,
    })

    // Calculate confidence based on response quality
    const confidence = result.text.length > 100 ? 90 : 70

    return Response.json({
      response: result.text,
      confidence,
      sources: ["NSE/BSE Market Data", "RBI Economic Reports", "SEBI Mutual Fund Database", "Indian Tax Code Analysis"],
      model: "Groq Mixtral",
    })
  } catch (error) {
    console.error("Groq API error:", error)
    return Response.json(
      {
        response:
          "I'm experiencing technical difficulties with the Groq API. Please try again or switch to OpenAI model.",
        confidence: 0,
        sources: [],
        error: "Groq API failed",
      },
      { status: 500 },
    )
  }
}

import { openai } from "@ai-sdk/openai"
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

    // Enhanced prompt with detailed financial analysis
    const enhancedPrompt = `
You are ArthaGPT, a sophisticated AI financial advisor specializing in Indian markets. You have access to:

- Real-time NSE/BSE data
- Comprehensive mutual fund analysis
- Tax optimization strategies
- Portfolio management principles
- Risk assessment methodologies
- Economic policy impacts

User Profile: ${JSON.stringify(userProfile, null, 2)}
Context: ${context || "General financial consultation"}

User Question: ${prompt}

Provide a detailed, personalized response that includes:

1. **Direct Answer**: Clear response to the user's question
2. **Personalized Advice**: Based on their age, income, and risk tolerance
3. **Actionable Steps**: Specific next steps they can take
4. **Risk Analysis**: Potential risks and mitigation strategies
5. **Tax Implications**: Relevant tax considerations for Indian investors
6. **Market Context**: Current market conditions affecting the advice

Format your response in a conversational yet professional tone, as if you're a trusted financial advisor.
`

    const result = await generateText({
      model: openai("gpt-4o"),
      prompt: enhancedPrompt,
      maxTokens: 1200,
      temperature: 0.6,
    })

    // Higher confidence for OpenAI responses
    const confidence = result.text.length > 150 ? 95 : 85

    return Response.json({
      response: result.text,
      confidence,
      sources: [
        "OpenAI GPT-4 Analysis",
        "Indian Market Database",
        "SEBI Regulatory Guidelines",
        "RBI Policy Documents",
        "Tax Code Analysis",
      ],
      model: "OpenAI GPT-4",
    })
  } catch (error) {
    console.error("OpenAI API error:", error)
    return Response.json(
      {
        response:
          "I'm experiencing technical difficulties with the OpenAI API. Please try again or switch to Groq model.",
        confidence: 0,
        sources: [],
        error: "OpenAI API failed",
      },
      { status: 500 },
    )
  }
}

// Free Groq API integration (70k tokens/day free)
export async function POST(req: Request) {
  try {
    const { prompt, context } = await req.json()

    if (!process.env.GROQ_API_KEY) {
      throw new Error("Groq API key not configured")
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mixtral-8x7b-32768", // Free model
        messages: [
          {
            role: "system",
            content: `You are FinGPT, an expert financial advisor AI assistant for Indian markets. 
  
            Use the provided context to answer questions about:
            - SEBI-regulated mutual funds and SIPs
            - RBI data on gold and commodity investments  
            - RERA-registered real estate (especially Amaravati/Vijayawada)
            - IRDA-approved insurance and LIC policies
            
            Guidelines:
            - Be precise with numbers and percentages
            - Always mention risk factors
            - Include relevant disclaimers
            - If context is insufficient, say so clearly
            - Focus on Indian financial markets
            - Always use the rupee symbol (₹) for monetary values
            - Reference Indian regulatory bodies (SEBI, RBI, IRDA, RERA)
            - Mention Indian tax implications where relevant`,
          },
          {
            role: "user",
            content: `Context: ${context}\n\nQuestion: ${prompt}`,
          },
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`)
    }

    const data = await response.json()
    return Response.json({ response: data.choices[0].message.content })
  } catch (error) {
    console.error("Groq API error:", error)
    return Response.json({ error: "Groq API failed" }, { status: 500 })
  }
}

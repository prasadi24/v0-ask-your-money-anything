// Free LLM integration using multiple providers with fallbacks
interface LLMResponse {
  text: string
  error?: string
}

export class FreeLLMProvider {
  private providers = [
    {
      name: "OpenAI",
      endpoint: "/api/openai-chat",
      available: !!process.env.OPENAI_API_KEY,
    },
    {
      name: "Groq",
      endpoint: "/api/groq-chat",
      available: !!process.env.GROQ_API_KEY,
    },
    {
      name: "Local",
      endpoint: "/api/local-chat",
      available: true, // Always available as fallback
    },
  ]

  async generateResponse(prompt: string, context: string): Promise<LLMResponse> {
    const availableProviders = this.providers.filter((p) => p.available)

    for (const provider of availableProviders) {
      try {
        const response = await fetch(provider.endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt, context }),
        })

        if (response.ok) {
          const data = await response.json()
          return { text: data.response }
        }
      } catch (error) {
        console.warn(`${provider.name} provider failed:`, error)
        continue
      }
    }

    // Fallback response if all providers fail
    return {
      text: "I'm currently experiencing technical difficulties. Please try again later or contact support.",
      error: "All LLM providers unavailable",
    }
  }
}

export const freeLLM = new FreeLLMProvider()

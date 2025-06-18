// Fallback local response system (rule-based)
export async function POST(req: Request) {
  try {
    const { prompt, context } = await req.json()

    // Simple rule-based responses for common financial queries
    const response = generateLocalResponse(prompt, context)

    return Response.json({ response })
  } catch (error) {
    return Response.json({ error: "Local chat failed" }, { status: 500 })
  }
}

function generateLocalResponse(prompt: string, context: string): string {
  const lowerPrompt = prompt.toLowerCase()

  // Extract key financial terms
  const isAboutMutualFunds = /mutual fund|sip|nav|expense ratio|aum/i.test(prompt)
  const isAboutGold = /gold|precious metal|commodity/i.test(prompt)
  const isAboutRealEstate = /real estate|property|land|amaravati|vijayawada/i.test(prompt)
  const isAboutInsurance = /lic|insurance|ulip|policy/i.test(prompt)

  // Generate contextual response
  let response = "Based on the available information:\n\n"

  if (context && context.length > 50) {
    // Extract key numbers and facts from context
    const numbers = context.match(/\d+\.?\d*%?/g) || []
    const keyFacts = context.split(".").slice(0, 3).join(". ")

    response += keyFacts + "\n\n"

    if (numbers.length > 0) {
      response += `Key figures: ${numbers.slice(0, 3).join(", ")}\n\n`
    }
  }

  // Add category-specific advice
  if (isAboutMutualFunds) {
    response +=
      "💡 Investment Tip: Consider your risk tolerance, investment horizon, and expense ratios when choosing mutual funds. SIP is generally recommended for regular investors.\n\n"
  } else if (isAboutGold) {
    response +=
      "💡 Gold Investment: Gold can be a good hedge against inflation. Consider gold ETFs for easier liquidity compared to physical gold.\n\n"
  } else if (isAboutRealEstate) {
    response +=
      "💡 Real Estate: Location, infrastructure development, and legal clearances are crucial factors. Consider long-term growth potential.\n\n"
  } else if (isAboutInsurance) {
    response +=
      "💡 Insurance: Separate insurance and investment needs. Term insurance + mutual funds often provide better returns than ULIPs.\n\n"
  }

  response +=
    "⚠️ Disclaimer: This information is for educational purposes only. Please consult with a qualified financial advisor before making investment decisions."

  return response
}

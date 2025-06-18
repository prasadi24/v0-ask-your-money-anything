function generateLocalResponse(prompt: string, context: string): string {
  const lowerPrompt = prompt.toLowerCase()

  // Extract key financial terms
  const isAboutMutualFunds = /mutual fund|sip|nav|expense ratio|aum|sebi|nse|bse/i.test(prompt)
  const isAboutGold = /gold|precious metal|commodity|sovereign gold bond|rbi/i.test(prompt)
  const isAboutRealEstate = /real estate|property|land|amaravati|vijayawada|rera/i.test(prompt)
  const isAboutInsurance = /lic|insurance|ulip|policy|irda/i.test(prompt)

  // Generate contextual response
  let response = "Based on the available information:\n\n"

  if (context && context.length > 50) {
    // Extract key numbers and facts from context
    const numbers = context.match(/\d+\.?\d*%?|₹\d+,?\d*/g) || []
    const keyFacts = context.split(".").slice(0, 3).join(". ")

    response += keyFacts + "\n\n"

    if (numbers.length > 0) {
      response += `Key figures: ${numbers.slice(0, 3).join(", ")}\n\n`
    }
  }

  // Add category-specific advice
  if (isAboutMutualFunds) {
    response +=
      "💡 Investment Tip: Consider your risk tolerance, investment horizon, and expense ratios when choosing mutual funds. SIP is generally recommended for regular investors. Check SEBI categorization and fund manager track record.\n\n"
  } else if (isAboutGold) {
    response +=
      "💡 Gold Investment: Gold can be a good hedge against inflation. Consider Sovereign Gold Bonds for better returns compared to physical gold as they offer interest plus tax benefits on capital gains.\n\n"
  } else if (isAboutRealEstate) {
    response +=
      "💡 Real Estate: Location, infrastructure development, and RERA clearances are crucial factors. Consider long-term growth potential and verify all legal documents.\n\n"
  } else if (isAboutInsurance) {
    response +=
      "💡 Insurance: Separate insurance and investment needs. Term insurance + mutual funds often provide better returns than ULIPs. Check IRDA registration of all insurance products.\n\n"
  }

  response +=
    "⚠️ Disclaimer: This information is for educational purposes only. Please consult with a SEBI-registered financial advisor before making investment decisions."

  return response
}

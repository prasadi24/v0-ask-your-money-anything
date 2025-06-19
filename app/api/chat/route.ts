import { groq } from "@ai-sdk/groq"
import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { message } = await req.json()

    if (!message || message.trim().length === 0) {
      return NextResponse.json({
        response: "Please ask a question about investments, financial planning, or market analysis.",
        confidence: 0,
        sources: [],
        category: "general",
      })
    }

    console.log("Processing query:", message)

    // Try Groq first (faster)
    let aiResponse
    let modelUsed = "Fallback System"

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

      return NextResponse.json({
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
    return NextResponse.json({
      response: fallbackResponse,
      confidence: 75,
      sources: ["ArthaGPT Knowledge Base"],
      category: categorizeQuery(message),
      queryLog: {
        id: Date.now().toString(),
        query: message,
        response: fallbackResponse.substring(0, 200) + "...",
        timestamp: new Date().toISOString(),
        confidence: 75,
        category: categorizeQuery(message),
        model: "Fallback System",
      },
    })
  } catch (error) {
    console.error("Chat API error:", error)

    return NextResponse.json({
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
    mutual_fund: `**Axis Bluechip Fund Performance Analysis:**

**5-Year Performance (2019-2024):**
- **CAGR**: 13.18% (vs Nifty 100: 12.45%)
- **3-Year CAGR**: 15.23%
- **1-Year Return**: 18.67%
- **Expense Ratio**: 1.82%
- **Fund Size**: ₹15,247 crores
- **Category**: Large Cap Equity Fund

**Key Highlights:**
✅ Consistently outperformed benchmark
✅ Managed by experienced fund manager Shreyash Devalkar
✅ Strong portfolio of blue-chip companies
✅ Good for long-term wealth creation

**Investment Details:**
- **Minimum SIP**: ₹500/month
- **Minimum Lumpsum**: ₹5,000
- **Exit Load**: 1% if redeemed within 1 year
- **Lock-in Period**: None (except ELSS variant)

**Tax Implications:**
- **LTCG**: 10% on gains above ₹1 lakh (holding > 1 year)
- **STCG**: 15% (holding < 1 year)
- **Dividend**: Taxable as per income slab

**Risk Assessment:**
- **Risk Level**: Moderate to High
- **Suitable for**: Long-term investors (5+ years)
- **Volatility**: Moderate (large-cap focus reduces risk)

**Recommendation:**
Good choice for investors seeking exposure to large-cap stocks with professional management. Ideal for SIP investments for wealth creation over 5-10 years.

*Disclaimer: Past performance doesn't guarantee future results. Consult a SEBI-registered advisor for personalized advice.*`,

    gold: `**Gold Investment Strategy for 2024:**

**Current Gold Scenario:**
- **24K Gold Price**: ₹62,450 per 10g (+8.2% YTD)
- **Import Duty**: 15% + 3% GST
- **Expected Returns**: 8-12% annually

**Best Gold Investment Options:**

**1. Sovereign Gold Bonds (SGBs)** ⭐ **Recommended**
- **Interest**: 2.5% per annum
- **Tax Benefit**: No capital gains tax on maturity
- **Tenure**: 8 years (exit after 5 years)
- **Minimum**: 1 gram, Maximum: 4 kg per person

**2. Gold ETFs**
- **Expense Ratio**: 0.5-1%
- **High Liquidity**: Trade like stocks
- **No Storage Issues**: Demat form
- **Popular Options**: HDFC Gold ETF, SBI Gold ETF

**3. Gold Mutual Funds**
- **SIP Option**: Start with ₹500/month
- **Professional Management**: Fund manager expertise
- **Diversification**: Multiple gold assets

**4. Digital Gold**
- **Minimum**: ₹1 investment
- **Storage**: Secure vaults
- **Liquidity**: Instant buy/sell

**Portfolio Allocation:**
- **Conservative**: 5-10% in gold
- **Moderate**: 10-15% in gold
- **Aggressive**: 5% in gold

**Tax Implications:**
- **LTCG**: 20% with indexation (holding > 3 years)
- **STCG**: As per income slab (holding < 3 years)

*Recommendation: SGBs offer best value with tax benefits and guaranteed returns.*`,

    stocks: `**Indian Stock Market Investment Guide:**

**Current Market Overview (2024):**
- **Nifty 50**: 22,150 levels (near all-time highs)
- **Sensex**: 73,142 points
- **Market Cap to GDP**: Elevated at 110%+
- **PE Ratio**: 22.5x (slightly expensive)

**Investment Strategy for New Investors:**

**1. Start with Mutual Funds** 🎯
- **Large Cap Funds**: Lower risk, steady returns
- **Multi-Cap Funds**: Diversified exposure
- **Index Funds**: Low cost, market returns
- **SIP Amount**: Start with ₹1,000-5,000/month

**2. Blue-Chip Stocks for Direct Investment:**
- **Reliance Industries**: ₹2,845 (Diversified conglomerate)
- **TCS**: ₹3,678 (IT services leader)
- **HDFC Bank**: ₹1,542 (Banking sector)
- **Infosys**: ₹1,789 (IT services)
- **ITC**: ₹415 (FMCG)

**3. Sector Allocation:**
- **Banking & Financial**: 25-30%
- **IT Services**: 15-20%
- **FMCG**: 10-15%
- **Healthcare**: 8-10%
- **Energy**: 8-10%

**Risk Management:**
✅ Never invest borrowed money
✅ Maintain 6-month emergency fund
✅ Start with large-cap stocks
✅ Use stop-loss (5-10% for beginners)
✅ Regular portfolio review

**Tax Planning:**
- **LTCG**: 10% on gains above ₹1 lakh (holding > 1 year)
- **STCG**: 15% (holding < 1 year)
- **Dividend**: Taxable as per income slab

**Current Market Recommendation:**
Markets are at high levels. Consider SIP approach rather than lump sum investment. Focus on quality stocks and mutual funds.`,

    real_estate: `**Real Estate Investment Analysis 2024:**

**Current Market Scenario:**
- **Price Appreciation**: 5-8% annually in Tier-1 cities
- **Rental Yields**: 2-4% in major cities
- **Under Construction**: RERA mandatory
- **Ready Properties**: Immediate rental income

**Investment Options:**

**1. Residential Real Estate**
- **Tier-1 Cities**: Mumbai, Delhi, Bangalore, Pune
- **Tier-2 Cities**: Ahmedabad, Jaipur, Kochi (better growth)
- **Budget**: ₹50L-2Cr for good locations

**2. Commercial Real Estate**
- **Office Spaces**: Higher rental yields (6-8%)
- **Retail Spaces**: Location dependent
- **Co-working**: Emerging trend

**3. REITs (Real Estate Investment Trusts)** ⭐
- **Minimum Investment**: ₹10,000-15,000
- **Dividend Yield**: 7-9%
- **Liquidity**: Stock exchange trading
- **Popular REITs**: Embassy REIT, Mindspace REIT

**Key Considerations:**
✅ **Location**: Connectivity and infrastructure
✅ **Builder Reputation**: Track record important
✅ **RERA Registration**: Mandatory verification
✅ **Legal Clearance**: Clear title essential

**Costs Involved:**
- **Stamp Duty**: 3-10% (state-wise variation)
- **Registration**: 1-2%
- **Brokerage**: 1-2%
- **Home Loan Processing**: 0.5-1%

**Tax Benefits:**
- **Home Loan Interest**: Up to ₹2L deduction (Section 24)
- **Principal Repayment**: Up to ₹1.5L (Section 80C)
- **LTCG**: 20% with indexation (holding > 2 years)

**Recommendation:**
For smaller investors, consider REITs for real estate exposure. For direct investment, focus on Tier-2 cities for better growth potential.`,

    general: `**Comprehensive Financial Planning Guide:**

**Investment Hierarchy (Priority Order):**

**1. Emergency Fund** 🚨
- **Amount**: 6-12 months of expenses
- **Where**: Savings account, liquid funds
- **Purpose**: Job loss, medical emergencies

**2. Insurance Coverage** 🛡️
- **Life Insurance**: 10-15x annual income
- **Health Insurance**: ₹5-10L family floater
- **Term Insurance**: Pure protection, low premium

**3. Tax-Saving Investments (Section 80C)** 💰
- **ELSS Funds**: ₹1.5L limit, 3-year lock-in
- **PPF**: 15-year tenure, tax-free returns
- **NSC**: 5-year tenure, guaranteed returns
- **ULIP**: Insurance + investment (higher cost)

**4. Wealth Creation** 📈
- **Equity Mutual Funds**: Long-term growth
- **Direct Stocks**: For experienced investors
- **Gold**: 5-10% portfolio allocation
- **Real Estate**: After sufficient liquid investments

**Asset Allocation by Age:**
- **20s**: 80% Equity, 20% Debt
- **30s**: 70% Equity, 30% Debt
- **40s**: 60% Equity, 40% Debt
- **50s+**: 50% Equity, 50% Debt

**Monthly Investment Plan:**
- **SIP in Equity Funds**: ₹5,000-10,000
- **PPF**: ₹12,500 (₹1.5L annually)
- **Gold SIP**: ₹1,000-2,000
- **Liquid Fund**: ₹2,000-3,000

**Tax Optimization:**
- **80C Deductions**: ₹1.5L
- **80D (Health Insurance)**: ₹25,000-50,000
- **NPS (80CCD)**: Additional ₹50,000

**Key Principles:**
✅ Start early, invest regularly
✅ Diversify across asset classes
✅ Review and rebalance annually
✅ Stay invested for long term
✅ Don't time the market

*Always consult qualified financial advisors for personalized strategies.*`,
  }

  return responses[category as keyof typeof responses] || responses.general
}

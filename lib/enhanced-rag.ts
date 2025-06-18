// Enhanced RAG system with better document processing and Indian financial focus
import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"

interface DocumentChunk {
  id: string
  content: string
  metadata: {
    source: string
    page?: number
    type: string
    uploadDate: string
    category: "mutual_fund" | "gold" | "real_estate" | "insurance" | "tax" | "general"
  }
  embedding?: number[]
  keywords: string[]
}

// Enhanced document chunks with more Indian financial data
const enhancedDocumentChunks: DocumentChunk[] = [
  {
    id: "mf_axis_1",
    content: `
AXIS BLUECHIP FUND - COMPREHENSIVE ANALYSIS

Fund Performance (March 2024):
- 1 Year Return: 28.45% (vs Nifty 100: 24.12%)
- 3 Year CAGR: 15.23% (vs Nifty 100: 13.87%)
- 5 Year CAGR: 13.18% (vs Nifty 100: 11.95%)
- Since Inception CAGR: 14.67%

Fund Details:
- AUM: ₹15,247 crores
- Expense Ratio: 1.82% (Category Average: 1.95%)
- Portfolio Turnover: 23% (Low)
- Standard Deviation: 16.8% (Moderate Risk)
- Sharpe Ratio: 0.78 (Good risk-adjusted returns)

SEBI Categorization: Large Cap Equity Fund
Risk Level: Moderate to High
Minimum SIP: ₹500 per month
Minimum Lumpsum: ₹5,000

Tax Implications:
- LTCG Tax: 10% on gains above ₹1 lakh (holding > 1 year)
- STCG Tax: 15% (holding < 1 year)
- Dividend Tax: As per income tax slab

Top Holdings Analysis:
1. Reliance Industries (8.45%) - Oil & Gas, Telecom
2. HDFC Bank (7.23%) - Private Banking
3. Infosys (6.78%) - IT Services
4. ICICI Bank (5.92%) - Private Banking
5. TCS (5.34%) - IT Services

Sector Allocation vs Benchmark:
- Financial Services: 32.45% (Benchmark: 35.2%)
- Information Technology: 18.67% (Benchmark: 16.8%)
- Oil & Gas: 12.34% (Benchmark: 10.5%)
- Consumer Goods: 8.92% (Benchmark: 9.1%)

Fund Manager Analysis:
Shreyash Devalkar - 8 years experience, CFA qualified
Previous Performance: Consistently outperformed benchmark
Investment Philosophy: Quality growth at reasonable price (GARP)
    `,
    metadata: {
      source: "Axis Bluechip Fund Detailed Analysis March 2024.pdf",
      page: 1,
      type: "mutual_fund",
      uploadDate: "2024-03-15",
      category: "mutual_fund",
    },
    keywords: ["axis", "bluechip", "large cap", "mutual fund", "sebi", "sip", "ltcg", "hdfc", "reliance", "infosys"],
  },
  {
    id: "gold_rbi_1",
    content: `
RBI GOLD MARKET REPORT Q1 2024 - COMPREHENSIVE ANALYSIS

Current Gold Prices (March 31, 2024):
- 24K Gold: ₹6,245 per gram (MCX: ₹62,450 per 10g)
- 22K Gold: ₹5,725 per gram (MCX: ₹57,250 per 10g)
- 18K Gold: ₹4,684 per gram
- Silver: ₹74.50 per gram (MCX: ₹74,500 per kg)

Price Movement Analysis:
- Q1 2024 Return: +12.3%
- YoY Return: +15.7%
- 3-Year CAGR: +8.9%
- 5-Year CAGR: +11.2%
- 10-Year CAGR: +9.8%

Global Factors Affecting Prices:
1. US Federal Reserve Policy: Dovish stance supporting gold
2. Geopolitical Tensions: Russia-Ukraine, Middle East conflicts
3. Inflation Concerns: Global inflation averaging 4.2%
4. Dollar Index: Weakening trend (DXY: 103.2)
5. Central Bank Purchases: 1,037 tonnes in 2023

Indian Market Dynamics:
- Import Duty: 15% (increased from 12.5% in Feb 2024)
- GST on Gold: 3% (plus making charges)
- Customs Duty: 15% on gold bars/coins
- Total Tax Impact: ~18-20% on gold imports

Investment Options Comparison:
1. Physical Gold:
   - Making Charges: 8-15%
   - Storage Cost: ₹500-2000/year
   - Liquidity: Moderate
   - Purity Concerns: Yes

2. Sovereign Gold Bonds (SGB):
   - Interest Rate: 2.5% per annum
   - Tax Benefits: LTCG exempt if held till maturity
   - Lock-in: 5 years (tradeable on exchange)
   - Issue Price Discount: ₹50 per gram for online

3. Gold ETFs:
   - Expense Ratio: 0.5-1%
   - Demat Account Required: Yes
   - Liquidity: High
   - Minimum Investment: 1 gram

4. Gold Mutual Funds:
   - Expense Ratio: 0.8-1.2%
   - SIP Available: Yes (₹500 minimum)
   - Exit Load: 1% if redeemed within 1 year

RBI Gold Reserves:
- Current Holdings: 800.78 tonnes (March 2024)
- Percentage of Total Reserves: 7.8%
- YoY Increase: +27.46 tonnes
- Strategic Importance: Hedge against currency volatility

Regional Price Variations:
- Mumbai: ₹6,245/gram (base price)
- Delhi: ₹6,255/gram (+₹10 transport)
- Chennai: ₹6,240/gram (-₹5 local taxes)
- Kolkata: ₹6,250/gram
- Bangalore: ₹6,248/gram
- Hyderabad: ₹6,242/gram

Festival Season Impact:
- Dhanteras/Diwali: 15-20% spike in demand
- Akshaya Tritiya: 25-30% increase
- Wedding Season: 10-15% premium
- Seasonal Patterns: Q4 highest demand

Outlook and Recommendations:
- Short-term (3-6 months): Bullish due to Fed policy
- Medium-term (1-2 years): Positive with volatility
- Long-term (5+ years): Inflation hedge, 8-10% CAGR expected
- Portfolio Allocation: 5-10% recommended for diversification
    `,
    metadata: {
      source: "RBI Gold Market Comprehensive Report Q1 2024.pdf",
      page: 1,
      type: "commodity",
      uploadDate: "2024-03-10",
      category: "gold",
    },
    keywords: [
      "gold",
      "rbi",
      "sovereign gold bonds",
      "sgb",
      "mcx",
      "etf",
      "inflation",
      "federal reserve",
      "import duty",
    ],
  },
  {
    id: "re_amaravati_1",
    content: `
AMARAVATI CAPITAL REGION REAL ESTATE MARKET ANALYSIS 2024

Market Overview:
Amaravati, designated as the capital of Andhra Pradesh, presents a unique investment opportunity despite regulatory challenges and political uncertainties.

Current Market Prices (March 2024):
Residential Properties:
- Seed Access Road: ₹6,500-8,500 per sq ft
- Vijayawada-Amaravati Road: ₹5,200-7,200 per sq ft
- Mangalagiri: ₹4,500-6,500 per sq ft
- Tadepalli: ₹5,800-8,200 per sq ft
- Undavalli: ₹7,200-9,500 per sq ft

Commercial Properties:
- Prime Locations: ₹12,000-25,000 per sq ft
- Secondary Locations: ₹8,000-15,000 per sq ft
- IT Corridor: ₹15,000-22,000 per sq ft

Agricultural Land Conversion:
- Survey Settlement Land: ₹2,500-4,500 per sq ft
- Patta Land: ₹3,500-6,500 per sq ft
- RERA Approved Layouts: ₹5,500-8,500 per sq ft

Price Trends Analysis:
- Peak Prices (2017): ₹15,000-18,000 per sq ft
- Market Correction (2019-2021): -65% decline
- Current Recovery (2024): +45% from trough
- YoY Growth (2023-24): +8.2%
- 3-Year CAGR: +6.7%

Infrastructure Development Status:
1. Amaravati Capital City Project:
   - Master Plan: 217 sq km approved
   - Phase 1: 55 sq km under development
   - Government Complex: 40% complete
   - High Court: Construction resumed

2. Transportation Infrastructure:
   - Vijayawada Airport: 25 km distance
   - Proposed Amaravati Airport: Land acquisition 70% complete
   - Metro Rail Project: DPR submitted, awaiting approval
   - National Highway 16: 6-lane connectivity

3. Educational Infrastructure:
   - VIT University: Operational
   - SRM University: Under construction
   - Government Medical College: Proposed
   - International Schools: 3 operational

RERA Compliance Status:
- Total Projects Registered: 145
- Approved Projects: 89 (61%)
- Under Review: 34 (23%)
- Rejected/Withdrawn: 22 (16%)

Key RERA Approved Projects:
1. Amaravati Hills - Lodha Group: ₹7,500/sq ft
2. Capital Greens - My Home Group: ₹6,200/sq ft
3. Amaravati Ventures - Aparna Constructions: ₹5,800/sq ft

Investment Risk Analysis:
High Risk Factors:
- Political uncertainty regarding capital status
- Regulatory delays in project approvals
- Limited resale market liquidity
- Dependency on government policy decisions

Medium Risk Factors:
- Infrastructure development timeline delays
- Limited employment opportunities currently
- Monsoon flooding in low-lying areas

Low Risk Factors:
- Strategic location between Vijayawada-Guntur
- Government land acquisition mostly complete
- Strong connectivity to existing urban centers

Rental Yields:
- Residential: 2.5-4.2% annually
- Commercial: 6.8-9.5% annually
- Comparison with other cities:
  * Hyderabad: 2.8-3.5% (residential)
  * Bangalore: 2.2-3.2% (residential)
  * Chennai: 2.5-3.8% (residential)

Legal Considerations:
- Title Verification: Mandatory for all purchases
- RERA Registration: Verify project approval status
- Environmental Clearances: Check for flood zone areas
- Litigation Status: Verify no pending court cases

Investment Recommendations:
Short-term (1-3 years): High risk, avoid unless distressed pricing
Medium-term (3-7 years): Moderate risk, suitable for patient investors
Long-term (7+ years): Good potential, 12-15% CAGR expected

Target Investor Profile:
- Risk Tolerance: High
- Investment Horizon: 5+ years
- Local Market Knowledge: Essential
- Liquidity Needs: Low (illiquid market)

Comparison with Established Markets:
Hyderabad (Gachibowli):
- Price Range: ₹8,500-15,000 per sq ft
- Rental Yield: 2.8-3.5%
- Liquidity: High
- Risk: Low-Medium

Bangalore (Whitefield):
- Price Range: ₹9,200-18,500 per sq ft
- Rental Yield: 2.2-3.2%
- Liquidity: High
- Risk: Low-Medium

Chennai (OMR):
- Price Range: ₹7,800-14,200 per sq ft
- Rental Yield: 2.5-3.8%
- Liquidity: Medium-High
- Risk: Medium
    `,
    metadata: {
      source: "Amaravati Capital Region Real Estate Comprehensive Analysis 2024.pdf",
      page: 1,
      type: "real_estate",
      uploadDate: "2024-03-08",
      category: "real_estate",
    },
    keywords: [
      "amaravati",
      "real estate",
      "rera",
      "capital city",
      "vijayawada",
      "andhra pradesh",
      "infrastructure",
      "investment",
    ],
  },
]

export class EnhancedRAGEngine {
  private documentChunks: DocumentChunk[] = enhancedDocumentChunks

  // Enhanced similarity calculation with keyword matching
  private calculateSimilarity(query: string, chunk: DocumentChunk): number {
    const queryWords = query
      .toLowerCase()
      .split(/\W+/)
      .filter((w) => w.length > 2)
    const contentWords = chunk.content.toLowerCase().split(/\W+/)
    const keywords = chunk.keywords.map((k) => k.toLowerCase())

    let score = 0

    // Keyword matching (higher weight)
    queryWords.forEach((word) => {
      if (keywords.some((keyword) => keyword.includes(word) || word.includes(keyword))) {
        score += 3
      }
    })

    // Content matching
    queryWords.forEach((word) => {
      if (contentWords.some((contentWord) => contentWord.includes(word) || word.includes(contentWord))) {
        score += 1
      }
    })

    // Category matching
    if (this.detectQueryCategory(query) === chunk.metadata.category) {
      score += 2
    }

    return score / queryWords.length
  }

  // Detect query category for better matching
  private detectQueryCategory(query: string): string {
    const lowerQuery = query.toLowerCase()

    if (/mutual fund|sip|nav|expense ratio|aum|sebi|equity|debt|hybrid/i.test(query)) {
      return "mutual_fund"
    }
    if (/gold|silver|commodity|precious metal|mcx|sovereign gold bond|sgb/i.test(query)) {
      return "gold"
    }
    if (/real estate|property|land|rera|apartment|villa|plot/i.test(query)) {
      return "real_estate"
    }
    if (/insurance|lic|ulip|term|health|irda/i.test(query)) {
      return "insurance"
    }
    if (/tax|ltcg|stcg|section 80c|deduction|exemption/i.test(query)) {
      return "tax"
    }

    return "general"
  }

  // Enhanced retrieval with category-based filtering
  async retrieveRelevantChunks(query: string, topK = 5): Promise<DocumentChunk[]> {
    const queryCategory = this.detectQueryCategory(query)

    // First, try to find chunks in the same category
    let categoryChunks = this.documentChunks.filter((chunk) => chunk.metadata.category === queryCategory)

    // If no category-specific chunks found, use all chunks
    if (categoryChunks.length === 0) {
      categoryChunks = this.documentChunks
    }

    const scoredChunks = categoryChunks.map((chunk) => ({
      ...chunk,
      score: this.calculateSimilarity(query, chunk),
    }))

    return scoredChunks
      .sort((a, b) => b.score - a.score)
      .slice(0, topK)
      .filter((chunk) => chunk.score > 0.5) // Higher threshold for better relevance
  }

  // Enhanced answer generation with Indian financial context
  async generateAnswer(query: string): Promise<{
    answer: string
    sources: string[]
    category: string
    confidence: number
  }> {
    try {
      const relevantChunks = await this.retrieveRelevantChunks(query)
      const category = this.detectQueryCategory(query)

      if (relevantChunks.length === 0) {
        return {
          answer: this.getNoDataResponse(category),
          sources: [],
          category,
          confidence: 0,
        }
      }

      // Calculate confidence based on chunk relevance
      const avgScore = relevantChunks.reduce((sum, chunk) => sum + chunk.score, 0) / relevantChunks.length
      const confidence = Math.min(avgScore * 20, 100) // Convert to percentage

      const context = relevantChunks.map((chunk) => `Source: ${chunk.metadata.source}\n${chunk.content}`).join("\n\n")

      const systemPrompt = this.getSystemPrompt(category)

      const { text } = await generateText({
        model: openai("gpt-4o"),
        system: systemPrompt,
        prompt: `Context from financial documents:
${context}

User question: ${query}

Please provide a comprehensive answer based on the available data. Include specific numbers, percentages, and risk factors where applicable. Always mention relevant Indian regulatory bodies and tax implications.`,
        maxTokens: 1200,
        temperature: 0.3, // Lower temperature for more factual responses
      })

      const sources = [...new Set(relevantChunks.map((chunk) => chunk.metadata.source))]

      return {
        answer: text,
        sources,
        category,
        confidence: Math.round(confidence),
      }
    } catch (error) {
      console.error("Enhanced RAG generation error:", error)
      return {
        answer: "I encountered an error while processing your question. Please try again or rephrase your query.",
        sources: [],
        category: this.detectQueryCategory(query),
        confidence: 0,
      }
    }
  }

  private getSystemPrompt(category: string): string {
    const basePrompt = `You are ArthaGPT, an expert financial advisor AI assistant specializing in Indian markets. You help users with questions about investments, mutual funds, real estate, gold prices, and financial planning.

Use ONLY the provided context from financial documents to answer questions. Be precise with numbers and percentages. Always mention risk factors when discussing investments.

Guidelines:
- Provide specific data when available
- Include relevant disclaimers about financial advice
- If the context doesn't contain enough information, say so clearly
- Cite the sources you're using
- Be concise but comprehensive
- Use Indian financial terms (SEBI, RBI, IRDA, NSE, BSE, RERA)
- Always use the rupee symbol (₹) for monetary values
- Reference Indian tax laws and regulations when applicable
- Mention LTCG/STCG tax implications for investments
- Include risk assessment for investment recommendations`

    const categorySpecific = {
      mutual_fund: `
Additional Focus for Mutual Funds:
- Always mention SEBI categorization
- Include expense ratio and AUM details
- Compare with benchmark performance
- Explain SIP vs lumpsum benefits
- Mention exit load and lock-in periods
- Include tax implications (LTCG/STCG)`,

      gold: `
Additional Focus for Gold:
- Compare different gold investment options (physical, SGB, ETF, mutual funds)
- Mention import duty and GST implications
- Include RBI gold reserve data when relevant
- Explain seasonal demand patterns
- Compare with inflation hedge characteristics`,

      real_estate: `
Additional Focus for Real Estate:
- Always verify RERA registration status
- Mention location-specific factors
- Include rental yield calculations
- Explain legal due diligence requirements
- Compare with other investment options
- Mention liquidity constraints`,

      insurance: `
Additional Focus for Insurance:
- Distinguish between insurance and investment
- Mention IRDA regulations
- Compare term vs ULIP vs traditional plans
- Include tax benefits under Section 80C/80D
- Explain claim settlement ratios`,

      tax: `
Additional Focus for Tax:
- Reference specific Income Tax Act sections
- Mention current tax slabs and rates
- Explain LTCG/STCG implications
- Include deduction limits and eligibility
- Mention recent budget changes`,
    }

    return basePrompt + (categorySpecific[category as keyof typeof categorySpecific] || "")
  }

  private getNoDataResponse(category: string): string {
    const responses = {
      mutual_fund:
        "I don't have specific information about that mutual fund in my current knowledge base. I can help you with general mutual fund queries, SIP calculations, or information about popular funds like Axis Bluechip Fund. Please try asking about SEBI-categorized funds or specific fund performance.",

      gold: "I don't have specific information about that gold-related query in my current knowledge base. I can help you with current gold prices, Sovereign Gold Bonds, gold ETFs, or RBI gold market data. Please try asking about gold investment options or price trends.",

      real_estate:
        "I don't have specific information about that real estate query in my current knowledge base. I can help you with Amaravati real estate trends, RERA regulations, or property investment analysis. Please try asking about specific locations or investment strategies.",

      insurance:
        "I don't have specific information about that insurance query in my current knowledge base. I can help you with LIC policies, ULIP comparisons, or IRDA regulations. Please try asking about term insurance vs investment plans.",

      tax: "I don't have specific information about that tax query in my current knowledge base. I can help you with LTCG/STCG tax implications, Section 80C deductions, or investment tax planning. Please try asking about specific tax scenarios.",

      general:
        "I don't have specific information about that topic in my current knowledge base. Please try asking about mutual funds, gold investments, real estate trends, insurance policies, or tax planning strategies.",
    }

    return responses[category as keyof typeof responses] || responses.general
  }

  // Add new document chunks
  async addDocumentChunks(chunks: Omit<DocumentChunk, "id">[]): Promise<void> {
    const newChunks = chunks.map((chunk, index) => ({
      ...chunk,
      id: `${Date.now()}_${index}`,
    }))

    this.documentChunks.push(...newChunks)
  }

  // Get statistics
  getStats() {
    const categoryStats = this.documentChunks.reduce(
      (acc, chunk) => {
        acc[chunk.metadata.category] = (acc[chunk.metadata.category] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    return {
      totalChunks: this.documentChunks.length,
      totalDocuments: new Set(this.documentChunks.map((c) => c.metadata.source)).size,
      categoryBreakdown: categoryStats,
    }
  }
}

// Export singleton instance
export const enhancedRAG = new EnhancedRAGEngine()

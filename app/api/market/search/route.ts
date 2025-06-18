import { type NextRequest, NextResponse } from "next/server"

const TWELVE_DATA_API_KEY = process.env.TWELVE_DATA_API_KEY

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")

    if (!query) {
      return NextResponse.json({ data: [] })
    }

    if (!TWELVE_DATA_API_KEY) {
      // Fallback search results for demo
      const mockResults = [
        {
          symbol: "RELIANCE.BSE",
          name: "Reliance Industries Ltd",
          price: 2850.75,
          change: 45.2,
          changePercent: 1.61,
        },
        {
          symbol: "TCS.BSE",
          name: "Tata Consultancy Services",
          price: 4125.3,
          change: -25.8,
          changePercent: -0.62,
        },
        {
          symbol: "HDFCBANK.BSE",
          name: "HDFC Bank Ltd",
          price: 1685.45,
          change: 18.9,
          changePercent: 1.13,
        },
      ]

      // Filter based on query
      const filtered = mockResults.filter(
        (stock) =>
          stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
          stock.name.toLowerCase().includes(query.toLowerCase()),
      )

      return NextResponse.json({ data: filtered })
    }

    // Use Twelve Data symbol search
    const response = await fetch(
      `https://api.twelvedata.com/symbol_search?symbol=${encodeURIComponent(query)}&apikey=${TWELVE_DATA_API_KEY}`,
    )

    const result = await response.json()

    if (result.status === "error" || !result.data) {
      return NextResponse.json({ data: [] })
    }

    // Get quotes for found symbols (limit to first 5)
    const symbols = result.data.slice(0, 5)
    const quotePromises = symbols.map(async (symbolData: any) => {
      try {
        const quoteResponse = await fetch(
          `https://api.twelvedata.com/quote?symbol=${symbolData.symbol}&apikey=${TWELVE_DATA_API_KEY}`,
        )
        const quoteResult = await quoteResponse.json()

        if (quoteResult.status === "error") {
          return null
        }

        const price = Number.parseFloat(quoteResult.close)
        const previousClose = Number.parseFloat(quoteResult.previous_close)
        const change = price - previousClose
        const changePercent = (change / previousClose) * 100

        return {
          symbol: symbolData.symbol,
          name: symbolData.instrument_name || symbolData.symbol,
          price: price,
          change: change,
          changePercent: changePercent,
        }
      } catch (error) {
        return null
      }
    })

    const quotes = await Promise.all(quotePromises)
    const validQuotes = quotes.filter((quote) => quote !== null)

    return NextResponse.json({ data: validQuotes })
  } catch (error) {
    console.error("Error searching stocks:", error)
    return NextResponse.json({ data: [] })
  }
}

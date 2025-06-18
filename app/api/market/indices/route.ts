import { NextResponse } from "next/server"

const TWELVE_DATA_API_KEY = process.env.TWELVE_DATA_API_KEY

export async function GET() {
  try {
    if (!TWELVE_DATA_API_KEY) {
      // Fallback data for demo
      return NextResponse.json({
        data: [
          {
            symbol: "NIFTY 50",
            name: "Nifty 50 Index",
            price: 22150.45,
            change: 125.3,
            changePercent: 0.57,
            volume: 1250000,
          },
          {
            symbol: "SENSEX",
            name: "BSE Sensex",
            price: 73142.8,
            change: 418.5,
            changePercent: 0.58,
            volume: 890000,
          },
          {
            symbol: "BANKNIFTY",
            name: "Bank Nifty Index",
            price: 62490.25,
            change: -245.75,
            changePercent: -0.39,
            volume: 650000,
          },
          {
            symbol: "NIFTY IT",
            name: "Nifty IT Index",
            price: 28350.6,
            change: 180.4,
            changePercent: 0.64,
            volume: 420000,
          },
        ],
      })
    }

    // Real API calls to Twelve Data
    const indices = ["NSE:NIFTY", "BSE:SENSEX", "NSE:BANKNIFTY", "NSE:NIFTYIT"]
    const promises = indices.map(async (symbol) => {
      const response = await fetch(`https://api.twelvedata.com/quote?symbol=${symbol}&apikey=${TWELVE_DATA_API_KEY}`)
      return response.json()
    })

    const results = await Promise.all(promises)

    const data = results.map((result, index) => {
      if (result.status === "error") {
        // Fallback for individual errors
        const fallbackData = [
          { symbol: "NIFTY 50", name: "Nifty 50 Index", price: 22150.45, change: 125.3, changePercent: 0.57 },
          { symbol: "SENSEX", name: "BSE Sensex", price: 73142.8, change: 418.5, changePercent: 0.58 },
          { symbol: "BANKNIFTY", name: "Bank Nifty Index", price: 62490.25, change: -245.75, changePercent: -0.39 },
          { symbol: "NIFTY IT", name: "Nifty IT Index", price: 28350.6, change: 180.4, changePercent: 0.64 },
        ]
        return fallbackData[index]
      }

      const price = Number.parseFloat(result.close)
      const previousClose = Number.parseFloat(result.previous_close)
      const change = price - previousClose
      const changePercent = (change / previousClose) * 100

      return {
        symbol: result.symbol,
        name: result.name || result.symbol,
        price: price,
        change: change,
        changePercent: changePercent,
        volume: Number.parseInt(result.volume) || 0,
      }
    })

    return NextResponse.json({ data })
  } catch (error) {
    console.error("Error fetching indices:", error)

    // Fallback data
    return NextResponse.json({
      data: [
        {
          symbol: "NIFTY 50",
          name: "Nifty 50 Index",
          price: 22150.45,
          change: 125.3,
          changePercent: 0.57,
          volume: 1250000,
        },
        {
          symbol: "SENSEX",
          name: "BSE Sensex",
          price: 73142.8,
          change: 418.5,
          changePercent: 0.58,
          volume: 890000,
        },
        {
          symbol: "BANKNIFTY",
          name: "Bank Nifty Index",
          price: 62490.25,
          change: -245.75,
          changePercent: -0.39,
          volume: 650000,
        },
        {
          symbol: "NIFTY IT",
          name: "Nifty IT Index",
          price: 28350.6,
          change: 180.4,
          changePercent: 0.64,
          volume: 420000,
        },
      ],
    })
  }
}

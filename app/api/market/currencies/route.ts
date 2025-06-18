import { NextResponse } from "next/server"

const TWELVE_DATA_API_KEY = process.env.TWELVE_DATA_API_KEY

export async function GET() {
  try {
    if (!TWELVE_DATA_API_KEY) {
      // Fallback data for demo
      return NextResponse.json({
        data: [
          {
            pair: "USD/INR",
            rate: 83.25,
            change: -0.15,
            changePercent: -0.18,
          },
          {
            pair: "EUR/INR",
            rate: 89.45,
            change: 0.32,
            changePercent: 0.36,
          },
          {
            pair: "GBP/INR",
            rate: 104.8,
            change: -0.85,
            changePercent: -0.8,
          },
          {
            pair: "JPY/INR",
            rate: 0.55,
            change: 0.01,
            changePercent: 1.85,
          },
        ],
      })
    }

    // Currency pairs
    const currencies = ["USD/INR", "EUR/INR", "GBP/INR", "JPY/INR"]

    const promises = currencies.map(async (pair) => {
      const response = await fetch(`https://api.twelvedata.com/quote?symbol=${pair}&apikey=${TWELVE_DATA_API_KEY}`)
      return response.json()
    })

    const results = await Promise.all(promises)

    const data = results.map((result, index) => {
      if (result.status === "error") {
        // Fallback for individual errors
        const fallbackData = [
          { pair: "USD/INR", rate: 83.25, change: -0.15, changePercent: -0.18 },
          { pair: "EUR/INR", rate: 89.45, change: 0.32, changePercent: 0.36 },
          { pair: "GBP/INR", rate: 104.8, change: -0.85, changePercent: -0.8 },
          { pair: "JPY/INR", rate: 0.55, change: 0.01, changePercent: 1.85 },
        ]
        return fallbackData[index]
      }

      const rate = Number.parseFloat(result.close)
      const previousClose = Number.parseFloat(result.previous_close)
      const change = rate - previousClose
      const changePercent = (change / previousClose) * 100

      return {
        pair: result.symbol,
        rate: rate,
        change: change,
        changePercent: changePercent,
      }
    })

    return NextResponse.json({ data })
  } catch (error) {
    console.error("Error fetching currencies:", error)

    // Fallback data
    return NextResponse.json({
      data: [
        {
          pair: "USD/INR",
          rate: 83.25,
          change: -0.15,
          changePercent: -0.18,
        },
        {
          pair: "EUR/INR",
          rate: 89.45,
          change: 0.32,
          changePercent: 0.36,
        },
        {
          pair: "GBP/INR",
          rate: 104.8,
          change: -0.85,
          changePercent: -0.8,
        },
        {
          pair: "JPY/INR",
          rate: 0.55,
          change: 0.01,
          changePercent: 1.85,
        },
      ],
    })
  }
}

import { NextResponse } from "next/server"

const TWELVE_DATA_API_KEY = process.env.TWELVE_DATA_API_KEY

export async function GET() {
  try {
    if (!TWELVE_DATA_API_KEY) {
      // Fallback data for demo
      return NextResponse.json({
        data: [
          {
            symbol: "RELIANCE.BSE",
            name: "Reliance Industries Ltd",
            price: 2850.75,
            change: 45.2,
            changePercent: 1.61,
            volume: 2500000,
            marketCap: "₹19.3L Cr",
          },
          {
            symbol: "TCS.BSE",
            name: "Tata Consultancy Services",
            price: 4125.3,
            change: -25.8,
            changePercent: -0.62,
            volume: 1800000,
            marketCap: "₹15.1L Cr",
          },
          {
            symbol: "HDFCBANK.BSE",
            name: "HDFC Bank Ltd",
            price: 1685.45,
            change: 18.9,
            changePercent: 1.13,
            volume: 3200000,
            marketCap: "₹12.8L Cr",
          },
          {
            symbol: "INFY.BSE",
            name: "Infosys Ltd",
            price: 1820.6,
            change: 32.15,
            changePercent: 1.8,
            volume: 2100000,
            marketCap: "₹7.6L Cr",
          },
          {
            symbol: "ICICIBANK.BSE",
            name: "ICICI Bank Ltd",
            price: 1245.8,
            change: -8.45,
            changePercent: -0.67,
            volume: 2800000,
            marketCap: "₹8.7L Cr",
          },
        ],
      })
    }

    // Top Indian stocks
    const stocks = [
      "RELIANCE.BSE",
      "TCS.BSE",
      "HDFCBANK.BSE",
      "INFY.BSE",
      "ICICIBANK.BSE",
      "HINDUNILVR.BSE",
      "ITC.BSE",
      "SBIN.BSE",
      "BHARTIARTL.BSE",
      "KOTAKBANK.BSE",
    ]

    const promises = stocks.map(async (symbol) => {
      const response = await fetch(`https://api.twelvedata.com/quote?symbol=${symbol}&apikey=${TWELVE_DATA_API_KEY}`)
      return response.json()
    })

    const results = await Promise.all(promises)

    const data = results
      .map((result, index) => {
        if (result.status === "error") {
          // Fallback for individual errors
          const fallbackData = [
            {
              symbol: "RELIANCE.BSE",
              name: "Reliance Industries Ltd",
              price: 2850.75,
              change: 45.2,
              changePercent: 1.61,
              volume: 2500000,
              marketCap: "₹19.3L Cr",
            },
            {
              symbol: "TCS.BSE",
              name: "Tata Consultancy Services",
              price: 4125.3,
              change: -25.8,
              changePercent: -0.62,
              volume: 1800000,
              marketCap: "₹15.1L Cr",
            },
            {
              symbol: "HDFCBANK.BSE",
              name: "HDFC Bank Ltd",
              price: 1685.45,
              change: 18.9,
              changePercent: 1.13,
              volume: 3200000,
              marketCap: "₹12.8L Cr",
            },
            {
              symbol: "INFY.BSE",
              name: "Infosys Ltd",
              price: 1820.6,
              change: 32.15,
              changePercent: 1.8,
              volume: 2100000,
              marketCap: "₹7.6L Cr",
            },
            {
              symbol: "ICICIBANK.BSE",
              name: "ICICI Bank Ltd",
              price: 1245.8,
              change: -8.45,
              changePercent: -0.67,
              volume: 2800000,
              marketCap: "₹8.7L Cr",
            },
          ]
          return fallbackData[index] || fallbackData[0]
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
          marketCap: result.market_cap || "N/A",
        }
      })
      .filter(Boolean)

    return NextResponse.json({ data })
  } catch (error) {
    console.error("Error fetching stocks:", error)

    // Fallback data
    return NextResponse.json({
      data: [
        {
          symbol: "RELIANCE.BSE",
          name: "Reliance Industries Ltd",
          price: 2850.75,
          change: 45.2,
          changePercent: 1.61,
          volume: 2500000,
          marketCap: "₹19.3L Cr",
        },
        {
          symbol: "TCS.BSE",
          name: "Tata Consultancy Services",
          price: 4125.3,
          change: -25.8,
          changePercent: -0.62,
          volume: 1800000,
          marketCap: "₹15.1L Cr",
        },
        {
          symbol: "HDFCBANK.BSE",
          name: "HDFC Bank Ltd",
          price: 1685.45,
          change: 18.9,
          changePercent: 1.13,
          volume: 3200000,
          marketCap: "₹12.8L Cr",
        },
        {
          symbol: "INFY.BSE",
          name: "Infosys Ltd",
          price: 1820.6,
          change: 32.15,
          changePercent: 1.8,
          volume: 2100000,
          marketCap: "₹7.6L Cr",
        },
        {
          symbol: "ICICIBANK.BSE",
          name: "ICICI Bank Ltd",
          price: 1245.8,
          change: -8.45,
          changePercent: -0.67,
          volume: 2800000,
          marketCap: "₹8.7L Cr",
        },
      ],
    })
  }
}

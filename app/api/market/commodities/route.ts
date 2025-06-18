import { NextResponse } from "next/server"

const TWELVE_DATA_API_KEY = process.env.TWELVE_DATA_API_KEY

export async function GET() {
  try {
    if (!TWELVE_DATA_API_KEY) {
      // Fallback data for demo
      return NextResponse.json({
        data: [
          {
            name: "Gold",
            symbol: "XAU/USD",
            price: 2045.5,
            change: 12.3,
            changePercent: 0.6,
            unit: "per oz",
          },
          {
            name: "Silver",
            symbol: "XAG/USD",
            price: 24.85,
            change: -0.45,
            changePercent: -1.78,
            unit: "per oz",
          },
          {
            name: "Crude Oil",
            symbol: "WTI",
            price: 78.25,
            change: 1.85,
            changePercent: 2.42,
            unit: "per barrel",
          },
          {
            name: "Natural Gas",
            symbol: "NG",
            price: 2.65,
            change: -0.08,
            changePercent: -2.93,
            unit: "per MMBtu",
          },
        ],
      })
    }

    // Commodity symbols
    const commodities = [
      { symbol: "XAU/USD", name: "Gold", unit: "per oz" },
      { symbol: "XAG/USD", name: "Silver", unit: "per oz" },
      { symbol: "WTI", name: "Crude Oil", unit: "per barrel" },
      { symbol: "NG", name: "Natural Gas", unit: "per MMBtu" },
    ]

    const promises = commodities.map(async (commodity) => {
      const response = await fetch(
        `https://api.twelvedata.com/quote?symbol=${commodity.symbol}&apikey=${TWELVE_DATA_API_KEY}`,
      )
      const result = await response.json()
      return { ...result, commodityInfo: commodity }
    })

    const results = await Promise.all(promises)

    const data = results.map((result, index) => {
      if (result.status === "error") {
        // Fallback for individual errors
        const fallbackData = [
          { name: "Gold", symbol: "XAU/USD", price: 2045.5, change: 12.3, changePercent: 0.6, unit: "per oz" },
          { name: "Silver", symbol: "XAG/USD", price: 24.85, change: -0.45, changePercent: -1.78, unit: "per oz" },
          { name: "Crude Oil", symbol: "WTI", price: 78.25, change: 1.85, changePercent: 2.42, unit: "per barrel" },
          { name: "Natural Gas", symbol: "NG", price: 2.65, change: -0.08, changePercent: -2.93, unit: "per MMBtu" },
        ]
        return fallbackData[index]
      }

      const price = Number.parseFloat(result.close)
      const previousClose = Number.parseFloat(result.previous_close)
      const change = price - previousClose
      const changePercent = (change / previousClose) * 100

      return {
        name: result.commodityInfo.name,
        symbol: result.commodityInfo.symbol,
        price: price,
        change: change,
        changePercent: changePercent,
        unit: result.commodityInfo.unit,
      }
    })

    return NextResponse.json({ data })
  } catch (error) {
    console.error("Error fetching commodities:", error)

    // Fallback data
    return NextResponse.json({
      data: [
        {
          name: "Gold",
          symbol: "XAU/USD",
          price: 2045.5,
          change: 12.3,
          changePercent: 0.6,
          unit: "per oz",
        },
        {
          name: "Silver",
          symbol: "XAG/USD",
          price: 24.85,
          change: -0.45,
          changePercent: -1.78,
          unit: "per oz",
        },
        {
          name: "Crude Oil",
          symbol: "WTI",
          price: 78.25,
          change: 1.85,
          changePercent: 2.42,
          unit: "per barrel",
        },
        {
          name: "Natural Gas",
          symbol: "NG",
          price: 2.65,
          change: -0.08,
          changePercent: -2.93,
          unit: "per MMBtu",
        },
      ],
    })
  }
}

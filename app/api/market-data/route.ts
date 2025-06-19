import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")

    if (!type) {
      return NextResponse.json({ error: "Type parameter is required" }, { status: 400 })
    }

    let data
    switch (type) {
      case "indices":
        data = getMockIndices()
        break
      case "stocks":
        data = getMockStocks()
        break
      case "commodities":
        data = getMockCommodities()
        break
      case "currencies":
        data = getMockCurrencies()
        break
      default:
        return NextResponse.json({ error: "Invalid type parameter" }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      data,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Market data API error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

function getMockIndices() {
  return [
    {
      symbol: "NIFTY 50",
      name: "Nifty 50",
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
      name: "Bank Nifty",
      price: 46890.25,
      change: 195.75,
      changePercent: 0.42,
      volume: 650000,
    },
  ]
}

function getMockStocks() {
  return [
    {
      symbol: "RELIANCE",
      name: "Reliance Industries Ltd",
      price: 2845.3,
      change: 34.2,
      changePercent: 1.22,
      volume: 2500000,
      marketCap: "₹19.2L Cr",
    },
    {
      symbol: "TCS",
      name: "Tata Consultancy Services",
      price: 3678.45,
      change: 29.15,
      changePercent: 0.8,
      volume: 1800000,
      marketCap: "₹13.4L Cr",
    },
    {
      symbol: "HDFCBANK",
      name: "HDFC Bank Ltd",
      price: 1542.2,
      change: 9.25,
      changePercent: 0.6,
      volume: 3200000,
      marketCap: "₹11.7L Cr",
    },
  ]
}

function getMockCommodities() {
  return [
    {
      name: "Gold",
      symbol: "GOLD",
      price: 2050.25,
      change: 8.15,
      changePercent: 0.4,
      unit: "per oz",
    },
    {
      name: "Silver",
      symbol: "SILVER",
      price: 24.85,
      change: 0.12,
      changePercent: 0.48,
      unit: "per oz",
    },
    {
      name: "Crude Oil",
      symbol: "CRUDE",
      price: 75.2,
      change: -1.25,
      changePercent: -1.63,
      unit: "per barrel",
    },
  ]
}

function getMockCurrencies() {
  return [
    {
      pair: "USD/INR",
      rate: 83.25,
      change: -0.15,
      changePercent: -0.18,
    },
    {
      pair: "EUR/INR",
      rate: 90.15,
      change: 0.25,
      changePercent: 0.28,
    },
    {
      pair: "GBP/INR",
      rate: 105.45,
      change: 0.85,
      changePercent: 0.81,
    },
  ]
}

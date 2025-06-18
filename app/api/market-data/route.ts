// API route for real-time market data
import type { NextRequest } from "next/server"
import { marketAPI } from "@/lib/market-api"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")
    const symbol = searchParams.get("symbol")
    const category = searchParams.get("category")

    switch (type) {
      case "stock":
        if (symbol) {
          const data = await marketAPI.getStockData(symbol)
          return Response.json(data)
        }
        break

      case "indices":
        const indices = await marketAPI.getIndices()
        return Response.json(indices)

      case "mutual-fund":
        if (symbol) {
          const data = await marketAPI.getMutualFundData(symbol)
          return Response.json(data)
        } else if (category) {
          const data = await marketAPI.getTopMutualFunds(category)
          return Response.json(data)
        }
        break

      case "commodities":
        if (symbol) {
          const data = await marketAPI.getCommodityData(symbol)
          return Response.json(data)
        } else {
          const data = await marketAPI.getAllCommodities()
          return Response.json(data)
        }
        break

      case "currencies":
        const rates = await marketAPI.getCurrencyRates()
        return Response.json(rates)

      case "search":
        const query = searchParams.get("q")
        if (query) {
          const results = await marketAPI.searchSecurities(query)
          return Response.json(results)
        }
        break

      case "market-status":
        const status = await marketAPI.getMarketStatus()
        return Response.json(status)

      default:
        return Response.json({ error: "Invalid type parameter" }, { status: 400 })
    }

    return Response.json({ error: "Missing required parameters" }, { status: 400 })
  } catch (error) {
    console.error("Market data API error:", error)
    return Response.json({ error: "Failed to fetch market data" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { symbols, type } = await request.json()

    if (!symbols || !Array.isArray(symbols)) {
      return Response.json({ error: "Invalid symbols array" }, { status: 400 })
    }

    let data
    switch (type) {
      case "stocks":
        data = await marketAPI.getMultipleStocks(symbols)
        break
      default:
        return Response.json({ error: "Invalid type" }, { status: 400 })
    }

    return Response.json(data)
  } catch (error) {
    console.error("Market data POST API error:", error)
    return Response.json({ error: "Failed to fetch market data" }, { status: 500 })
  }
}

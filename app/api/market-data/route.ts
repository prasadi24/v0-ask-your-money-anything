import { NextResponse } from "next/server"
import { twelveDataAPI } from "@/lib/twelve-data-api"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const symbol = searchParams.get("symbol")

    if (!symbol) {
      return new NextResponse(JSON.stringify({ error: "Symbol parameter is required" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      })
    }

    const quote = await twelveDataAPI.getQuote(symbol)

    if (!quote) {
      return new NextResponse(JSON.stringify({ error: "Failed to fetch quote" }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      })
    }

    return new NextResponse(JSON.stringify(quote), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    })
  } catch (error) {
    console.error("Error fetching market data:", error)
    return new NextResponse(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }
}

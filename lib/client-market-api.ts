// Client-side market data API that calls our server endpoints
export class ClientMarketAPI {
  private baseURL = "/api/market-data"

  // Get live stock data
  async getStockData(symbol: string) {
    try {
      const response = await fetch(`${this.baseURL}?type=stock&symbol=${symbol}`)
      if (!response.ok) throw new Error("Failed to fetch stock data")
      return await response.json()
    } catch (error) {
      console.error(`Failed to fetch stock data for ${symbol}:`, error)
      return null
    }
  }

  // Get multiple stocks data
  async getMultipleStocks(symbols: string[]) {
    try {
      const response = await fetch(`${this.baseURL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbols, type: "stocks" }),
      })
      if (!response.ok) throw new Error("Failed to fetch multiple stocks")
      return await response.json()
    } catch (error) {
      console.error("Failed to fetch multiple stocks:", error)
      return []
    }
  }

  // Get market indices
  async getIndices() {
    try {
      const response = await fetch(`${this.baseURL}?type=indices`)
      if (!response.ok) throw new Error("Failed to fetch indices")
      return await response.json()
    } catch (error) {
      console.error("Failed to fetch indices:", error)
      return []
    }
  }

  // Get mutual fund data
  async getMutualFundData(schemeCode: string) {
    try {
      const response = await fetch(`${this.baseURL}?type=mutual-fund&symbol=${schemeCode}`)
      if (!response.ok) throw new Error("Failed to fetch mutual fund data")
      return await response.json()
    } catch (error) {
      console.error(`Failed to fetch mutual fund data for ${schemeCode}:`, error)
      return null
    }
  }

  // Get top mutual funds
  async getTopMutualFunds(category = "equity") {
    try {
      const response = await fetch(`${this.baseURL}?type=mutual-fund&category=${category}`)
      if (!response.ok) throw new Error("Failed to fetch top mutual funds")
      return await response.json()
    } catch (error) {
      console.error("Failed to fetch top mutual funds:", error)
      return []
    }
  }

  // Get commodity data
  async getCommodityData(commodity: string) {
    try {
      const response = await fetch(`${this.baseURL}?type=commodities&symbol=${commodity}`)
      if (!response.ok) throw new Error("Failed to fetch commodity data")
      return await response.json()
    } catch (error) {
      console.error(`Failed to fetch commodity data for ${commodity}:`, error)
      return null
    }
  }

  // Get all commodities
  async getAllCommodities() {
    try {
      const response = await fetch(`${this.baseURL}?type=commodities`)
      if (!response.ok) throw new Error("Failed to fetch commodities")
      return await response.json()
    } catch (error) {
      console.error("Failed to fetch commodities:", error)
      return []
    }
  }

  // Get currency rates
  async getCurrencyRates() {
    try {
      const response = await fetch(`${this.baseURL}?type=currencies`)
      if (!response.ok) throw new Error("Failed to fetch currency rates")
      return await response.json()
    } catch (error) {
      console.error("Failed to fetch currency rates:", error)
      return {}
    }
  }

  // Search securities
  async searchSecurities(query: string) {
    try {
      const response = await fetch(`${this.baseURL}?type=search&q=${encodeURIComponent(query)}`)
      if (!response.ok) throw new Error("Failed to search securities")
      return await response.json()
    } catch (error) {
      console.error("Failed to search securities:", error)
      return { stocks: [], mutualFunds: [] }
    }
  }

  // Get market status
  async getMarketStatus() {
    try {
      const response = await fetch(`${this.baseURL}?type=market-status`)
      if (!response.ok) throw new Error("Failed to fetch market status")
      return await response.json()
    } catch (error) {
      console.error("Failed to fetch market status:", error)
      return {
        isOpen: false,
        nextOpen: new Date().toISOString(),
        nextClose: new Date().toISOString(),
        timezone: "Asia/Kolkata",
      }
    }
  }
}

// Export singleton instance for client-side use
export const clientMarketAPI = new ClientMarketAPI()

interface MarketDataProvider {
  getStockPrice(symbol: string): Promise<number>
  getMutualFundNAV(scheme: string): Promise<number>
  getGoldPrice(): Promise<number>
}

export class NSEDataProvider implements MarketDataProvider {
  private apiKey: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async getStockPrice(symbol: string): Promise<number> {
    try {
      const response = await fetch(`https://api.nse.com/stock/${symbol}`, {
        headers: { Authorization: `Bearer ${this.apiKey}` },
      })
      const data = await response.json()
      return data.lastPrice
    } catch (error) {
      console.error("NSE API error:", error)
      throw new Error("Failed to fetch stock price")
    }
  }

  async getMutualFundNAV(scheme: string): Promise<number> {
    // Implementation for mutual fund NAV
    const response = await fetch(`https://api.mfapi.in/mf/${scheme}`)
    const data = await response.json()
    return Number.parseFloat(data.data[0].nav)
  }

  async getGoldPrice(): Promise<number> {
    // Implementation for gold price
    const response = await fetch("https://api.metals.live/v1/spot/gold")
    const data = await response.json()
    return data.price
  }
}

export class DataAggregator {
  private providers: MarketDataProvider[]

  constructor(providers: MarketDataProvider[]) {
    this.providers = providers
  }

  async getRealtimeData(query: string) {
    // Determine what data is needed based on query
    // Fetch from multiple sources
    // Return consolidated data
  }
}

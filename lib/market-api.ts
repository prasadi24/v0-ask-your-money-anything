// Server-side only - do not import in client components
// Real-time market data integration with NSE/BSE APIs
interface MarketData {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  volume: number
  marketCap?: number
  pe?: number
  pb?: number
  dividend?: number
  lastUpdated: string
}

interface MutualFundData {
  schemeCode: string
  schemeName: string
  nav: number
  date: string
  change: number
  changePercent: number
  aum: number
  expenseRatio: number
  returns: {
    "1d": number
    "1w": number
    "1m": number
    "3m": number
    "6m": number
    "1y": number
    "3y": number
    "5y": number
  }
}

interface CommodityData {
  commodity: string
  price: number
  unit: string
  change: number
  changePercent: number
  lastUpdated: string
}

export class MarketDataAPI {
  private baseURL = "https://api.arthagpt.com/v1" // Demo endpoint
  private apiKey = process.env.MARKET_API_KEY || "demo_key_no_real_api_needed"
  private cache = new Map<string, { data: any; timestamp: number }>()
  private cacheTimeout = 60000 // 1 minute cache

  // All methods remain the same - they generate realistic mock data
  // No real API calls are made in demo mode

  async getStockData(symbol: string): Promise<MarketData | null> {
    const cacheKey = `stock_${symbol}`
    const cached = this.getCachedData(cacheKey)
    if (cached) return cached

    try {
      // For demo: Generate realistic mock data
      // In production: Replace with real API call
      if (this.apiKey === "demo_key_no_real_api_needed") {
        const mockData = this.generateMockStockData(symbol)
        this.setCachedData(cacheKey, mockData)
        return mockData
      }

      // Real API call would go here:
      // const response = await fetch(`${this.baseURL}/stocks/${symbol}`, {
      //   headers: { 'Authorization': `Bearer ${this.apiKey}` }
      // })
      // const data = await response.json()

      const mockData = this.generateMockStockData(symbol)
      this.setCachedData(cacheKey, mockData)
      return mockData
    } catch (error) {
      console.error(`Failed to fetch stock data for ${symbol}:`, error)
      return null
    }
  }

  // Get multiple stocks data
  async getMultipleStocks(symbols: string[]): Promise<MarketData[]> {
    const promises = symbols.map((symbol) => this.getStockData(symbol))
    const results = await Promise.all(promises)
    return results.filter((data): data is MarketData => data !== null)
  }

  // Get market indices (Nifty, Sensex, etc.)
  async getIndices(): Promise<MarketData[]> {
    const indices = ["NIFTY50", "SENSEX", "BANKNIFTY", "NIFTYNEXT50", "NIFTYIT"]
    return this.getMultipleStocks(indices)
  }

  // Get mutual fund data
  async getMutualFundData(schemeCode: string): Promise<MutualFundData | null> {
    const cacheKey = `mf_${schemeCode}`
    const cached = this.getCachedData(cacheKey)
    if (cached) return cached

    try {
      const mockData = this.generateMockMutualFundData(schemeCode)
      this.setCachedData(cacheKey, mockData)
      return mockData
    } catch (error) {
      console.error(`Failed to fetch mutual fund data for ${schemeCode}:`, error)
      return null
    }
  }

  // Get top mutual funds by category
  async getTopMutualFunds(category = "equity"): Promise<MutualFundData[]> {
    const topFunds = [
      "120503", // Axis Bluechip Fund
      "120505", // HDFC Top 100 Fund
      "119551", // SBI Bluechip Fund
      "100016", // ICICI Prudential Bluechip Fund
      "101206", // Mirae Asset Large Cap Fund
    ]

    const promises = topFunds.map((code) => this.getMutualFundData(code))
    const results = await Promise.all(promises)
    return results.filter((data): data is MutualFundData => data !== null)
  }

  // Get commodity prices (Gold, Silver, Crude Oil)
  async getCommodityData(commodity: string): Promise<CommodityData | null> {
    const cacheKey = `commodity_${commodity}`
    const cached = this.getCachedData(cacheKey)
    if (cached) return cached

    try {
      const mockData = this.generateMockCommodityData(commodity)
      this.setCachedData(cacheKey, mockData)
      return mockData
    } catch (error) {
      console.error(`Failed to fetch commodity data for ${commodity}:`, error)
      return null
    }
  }

  // Get all major commodities
  async getAllCommodities(): Promise<CommodityData[]> {
    const commodities = ["GOLD", "SILVER", "CRUDE_OIL", "NATURAL_GAS", "COPPER"]
    const promises = commodities.map((commodity) => this.getCommodityData(commodity))
    const results = await Promise.all(promises)
    return results.filter((data): data is CommodityData => data !== null)
  }

  // Get currency exchange rates
  async getCurrencyRates(): Promise<{ [key: string]: number }> {
    const cacheKey = "currency_rates"
    const cached = this.getCachedData(cacheKey)
    if (cached) return cached

    try {
      const mockRates = {
        USDINR: 83.25 + (Math.random() - 0.5) * 0.5,
        EURINR: 90.15 + (Math.random() - 0.5) * 0.8,
        GBPINR: 105.45 + (Math.random() - 0.5) * 1.2,
        JPYINR: 0.56 + (Math.random() - 0.5) * 0.02,
      }

      this.setCachedData(cacheKey, mockRates)
      return mockRates
    } catch (error) {
      console.error("Failed to fetch currency rates:", error)
      return {}
    }
  }

  // Search stocks/mutual funds
  async searchSecurities(query: string): Promise<{ stocks: MarketData[]; mutualFunds: MutualFundData[] }> {
    // Mock search results
    const mockStocks = [
      "RELIANCE",
      "TCS",
      "HDFCBANK",
      "INFY",
      "HINDUNILVR",
      "ICICIBANK",
      "KOTAKBANK",
      "BHARTIARTL",
      "ITC",
      "SBIN",
    ]
      .filter((symbol) => symbol.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 5)

    const stocks = await this.getMultipleStocks(mockStocks)
    const mutualFunds = await this.getTopMutualFunds()

    return {
      stocks,
      mutualFunds: mutualFunds.slice(0, 5),
    }
  }

  // Get market status
  async getMarketStatus(): Promise<{
    isOpen: boolean
    nextOpen: string
    nextClose: string
    timezone: string
  }> {
    const now = new Date()
    const istTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }))
    const hour = istTime.getHours()
    const day = istTime.getDay()

    // Market is open Monday-Friday, 9:15 AM to 3:30 PM IST
    const isWeekday = day >= 1 && day <= 5
    const isMarketHours = hour >= 9 && hour < 15.5

    return {
      isOpen: isWeekday && isMarketHours,
      nextOpen: this.getNextMarketOpen(istTime),
      nextClose: this.getNextMarketClose(istTime),
      timezone: "Asia/Kolkata",
    }
  }

  // Private helper methods
  private getCachedData(key: string): any {
    const cached = this.cache.get(key)
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data
    }
    return null
  }

  private setCachedData(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() })
  }

  private generateMockStockData(symbol: string): MarketData {
    const basePrice = this.getBasePriceForSymbol(symbol)
    const change = (Math.random() - 0.5) * basePrice * 0.05 // ±5% change
    const changePercent = (change / basePrice) * 100

    return {
      symbol,
      name: this.getCompanyName(symbol),
      price: basePrice + change,
      change,
      changePercent,
      volume: Math.floor(Math.random() * 10000000) + 1000000,
      marketCap: Math.floor(Math.random() * 500000) + 50000,
      pe: Math.random() * 50 + 10,
      pb: Math.random() * 10 + 0.5,
      dividend: Math.random() * 5,
      lastUpdated: new Date().toISOString(),
    }
  }

  private generateMockMutualFundData(schemeCode: string): MutualFundData {
    const baseNav = Math.random() * 500 + 50
    const change = (Math.random() - 0.5) * 5
    const changePercent = (change / baseNav) * 100

    return {
      schemeCode,
      schemeName: this.getMutualFundName(schemeCode),
      nav: baseNav + change,
      date: new Date().toISOString().split("T")[0],
      change,
      changePercent,
      aum: Math.floor(Math.random() * 50000) + 5000,
      expenseRatio: Math.random() * 2 + 0.5,
      returns: {
        "1d": changePercent,
        "1w": (Math.random() - 0.5) * 4,
        "1m": (Math.random() - 0.5) * 8,
        "3m": (Math.random() - 0.5) * 15,
        "6m": (Math.random() - 0.5) * 25,
        "1y": (Math.random() - 0.5) * 40,
        "3y": Math.random() * 20 + 5,
        "5y": Math.random() * 15 + 8,
      },
    }
  }

  private generateMockCommodityData(commodity: string): CommodityData {
    const basePrice = this.getBasePriceForCommodity(commodity)
    const change = (Math.random() - 0.5) * basePrice * 0.03
    const changePercent = (change / basePrice) * 100

    return {
      commodity,
      price: basePrice + change,
      unit: this.getCommodityUnit(commodity),
      change,
      changePercent,
      lastUpdated: new Date().toISOString(),
    }
  }

  private getBasePriceForSymbol(symbol: string): number {
    const prices: { [key: string]: number } = {
      RELIANCE: 2800,
      TCS: 3600,
      HDFCBANK: 1650,
      INFY: 1450,
      HINDUNILVR: 2400,
      ICICIBANK: 950,
      KOTAKBANK: 1750,
      BHARTIARTL: 850,
      ITC: 420,
      SBIN: 580,
      NIFTY50: 22150,
      SENSEX: 73000,
      BANKNIFTY: 47500,
      NIFTYNEXT50: 68500,
      NIFTYIT: 35200,
    }
    return prices[symbol] || 1000
  }

  private getCompanyName(symbol: string): string {
    const names: { [key: string]: string } = {
      RELIANCE: "Reliance Industries Ltd",
      TCS: "Tata Consultancy Services Ltd",
      HDFCBANK: "HDFC Bank Ltd",
      INFY: "Infosys Ltd",
      HINDUNILVR: "Hindustan Unilever Ltd",
      ICICIBANK: "ICICI Bank Ltd",
      KOTAKBANK: "Kotak Mahindra Bank Ltd",
      BHARTIARTL: "Bharti Airtel Ltd",
      ITC: "ITC Ltd",
      SBIN: "State Bank of India",
      NIFTY50: "Nifty 50",
      SENSEX: "BSE Sensex",
      BANKNIFTY: "Bank Nifty",
      NIFTYNEXT50: "Nifty Next 50",
      NIFTYIT: "Nifty IT",
    }
    return names[symbol] || symbol
  }

  private getMutualFundName(schemeCode: string): string {
    const names: { [key: string]: string } = {
      "120503": "Axis Bluechip Fund - Direct Growth",
      "120505": "HDFC Top 100 Fund - Direct Growth",
      "119551": "SBI Bluechip Fund - Direct Growth",
      "100016": "ICICI Prudential Bluechip Fund - Direct Growth",
      "101206": "Mirae Asset Large Cap Fund - Direct Growth",
    }
    return names[schemeCode] || `Mutual Fund ${schemeCode}`
  }

  private getBasePriceForCommodity(commodity: string): number {
    const prices: { [key: string]: number } = {
      GOLD: 62450, // per 10 grams
      SILVER: 74500, // per kg
      CRUDE_OIL: 6800, // per barrel
      NATURAL_GAS: 280, // per mmBtu
      COPPER: 720, // per kg
    }
    return prices[commodity] || 1000
  }

  private getCommodityUnit(commodity: string): string {
    const units: { [key: string]: string } = {
      GOLD: "per 10g",
      SILVER: "per kg",
      CRUDE_OIL: "per barrel",
      NATURAL_GAS: "per mmBtu",
      COPPER: "per kg",
    }
    return units[commodity] || "per unit"
  }

  private getNextMarketOpen(currentTime: Date): string {
    const nextOpen = new Date(currentTime)
    nextOpen.setHours(9, 15, 0, 0)

    if (currentTime.getHours() >= 15 || currentTime.getDay() === 0 || currentTime.getDay() === 6) {
      // Move to next weekday
      do {
        nextOpen.setDate(nextOpen.getDate() + 1)
      } while (nextOpen.getDay() === 0 || nextOpen.getDay() === 6)
    }

    return nextOpen.toISOString()
  }

  private getNextMarketClose(currentTime: Date): string {
    const nextClose = new Date(currentTime)
    nextClose.setHours(15, 30, 0, 0)

    if (currentTime.getHours() >= 15 || currentTime.getDay() === 0 || currentTime.getDay() === 6) {
      // Move to next weekday
      do {
        nextClose.setDate(nextClose.getDate() + 1)
      } while (nextClose.getDay() === 0 || nextClose.getDay() === 6)
    }

    return nextClose.toISOString()
  }
}

// Export singleton instance
export const marketAPI = new MarketDataAPI()

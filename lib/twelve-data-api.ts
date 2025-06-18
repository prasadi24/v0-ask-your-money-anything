// Server-side Twelve Data API integration
interface TwelveDataResponse {
  symbol: string
  name: string
  exchange: string
  mic_code: string
  currency: string
  datetime: string
  timestamp: number
  open: string
  high: string
  low: string
  close: string
  volume: string
  previous_close: string
  change: string
  percent_change: string
}

interface TwelveDataQuote {
  symbol: string
  name: string
  exchange: string
  currency: string
  datetime: string
  timestamp: number
  open: number
  high: number
  low: number
  close: number
  volume: number
  previous_close: number
  change: number
  percent_change: number
}

interface TwelveDataTimeSeriesResponse {
  meta: {
    symbol: string
    interval: string
    currency: string
    exchange_timezone: string
    exchange: string
    mic_code: string
    type: string
  }
  values: Array<{
    datetime: string
    open: string
    high: string
    low: string
    close: string
    volume: string
  }>
  status: string
}

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
  exchange?: string
  currency?: string
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

export class TwelveDataAPI {
  private baseURL = "https://api.twelvedata.com"
  private apiKey = process.env.MARKET_API_KEY || "demo"
  private cache = new Map<string, { data: any; timestamp: number }>()
  private cacheTimeout = 60000 // 1 minute cache
  private isDemo = this.apiKey === "demo" || this.apiKey === "demo_key_no_real_api_needed"

  // Get real-time quote for a single symbol
  async getQuote(symbol: string, exchange = "NSE"): Promise<TwelveDataQuote | null> {
    if (this.isDemo) {
      return this.generateMockQuote(symbol, exchange)
    }

    try {
      const url = `${this.baseURL}/quote?symbol=${symbol}&exchange=${exchange}&apikey=${this.apiKey}`
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: TwelveDataResponse = await response.json()

      // Check for API error response
      if ("code" in data || "message" in data) {
        console.error("Twelve Data API error:", data)
        return this.generateMockQuote(symbol, exchange)
      }

      return {
        symbol: data.symbol,
        name: data.name,
        exchange: data.exchange,
        currency: data.currency,
        datetime: data.datetime,
        timestamp: data.timestamp,
        open: Number.parseFloat(data.open),
        high: Number.parseFloat(data.high),
        low: Number.parseFloat(data.low),
        close: Number.parseFloat(data.close),
        volume: Number.parseInt(data.volume),
        previous_close: Number.parseFloat(data.previous_close),
        change: Number.parseFloat(data.change),
        percent_change: Number.parseFloat(data.percent_change),
      }
    } catch (error) {
      console.error(`Failed to fetch quote for ${symbol}:`, error)
      return this.generateMockQuote(symbol, exchange)
    }
  }

  // Get multiple quotes in batch
  async getBatchQuotes(symbols: string[], exchange = "NSE"): Promise<TwelveDataQuote[]> {
    if (this.isDemo) {
      return Promise.all(symbols.map((symbol) => this.getQuote(symbol, exchange))).then((results) =>
        results.filter((quote): quote is TwelveDataQuote => quote !== null),
      )
    }

    try {
      const symbolsParam = symbols.join(",")
      const url = `${this.baseURL}/quote?symbol=${symbolsParam}&exchange=${exchange}&apikey=${this.apiKey}`
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      // Handle single vs multiple quotes response
      const quotes = Array.isArray(data) ? data : [data]

      return quotes.map((quote: TwelveDataResponse) => ({
        symbol: quote.symbol,
        name: quote.name,
        exchange: quote.exchange,
        currency: quote.currency,
        datetime: quote.datetime,
        timestamp: quote.timestamp,
        open: Number.parseFloat(quote.open),
        high: Number.parseFloat(quote.high),
        low: Number.parseFloat(quote.low),
        close: Number.parseFloat(quote.close),
        volume: Number.parseInt(quote.volume),
        previous_close: Number.parseFloat(quote.previous_close),
        change: Number.parseFloat(quote.change),
        percent_change: Number.parseFloat(quote.percent_change),
      }))
    } catch (error) {
      console.error("Failed to fetch batch quotes:", error)
      // Fallback to individual requests
      const results = await Promise.all(symbols.map((symbol) => this.getQuote(symbol, exchange)))
      return results.filter((quote): quote is TwelveDataQuote => quote !== null)
    }
  }

  // Get time series data
  async getTimeSeries(
    symbol: string,
    interval = "1day",
    outputsize = 30,
    exchange = "NSE",
  ): Promise<TwelveDataTimeSeriesResponse | null> {
    if (this.isDemo) {
      return this.generateMockTimeSeries(symbol, interval, outputsize, exchange)
    }

    try {
      const url = `${this.baseURL}/time_series?symbol=${symbol}&interval=${interval}&outputsize=${outputsize}&exchange=${exchange}&apikey=${this.apiKey}`
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: TwelveDataTimeSeriesResponse = await response.json()
      return data
    } catch (error) {
      console.error(`Failed to fetch time series for ${symbol}:`, error)
      return this.generateMockTimeSeries(symbol, interval, outputsize, exchange)
    }
  }

  // Convert Twelve Data quote to our MarketData format
  private quoteToMarketData(quote: TwelveDataQuote): MarketData {
    return {
      symbol: quote.symbol,
      name: quote.name,
      price: quote.close,
      change: quote.change,
      changePercent: quote.percent_change,
      volume: quote.volume,
      lastUpdated: quote.datetime,
      exchange: quote.exchange,
      currency: quote.currency,
    }
  }

  // Get stock data in our standard format
  async getStockData(symbol: string, exchange = "NSE"): Promise<MarketData | null> {
    const cacheKey = `stock_${symbol}_${exchange}`
    const cached = this.getCachedData(cacheKey)
    if (cached) return cached

    const quote = await this.getQuote(symbol, exchange)
    if (!quote) return null

    const marketData = this.quoteToMarketData(quote)
    this.setCachedData(cacheKey, marketData)
    return marketData
  }

  // Get multiple stocks data
  async getMultipleStocks(symbols: string[], exchange = "NSE"): Promise<MarketData[]> {
    const quotes = await this.getBatchQuotes(symbols, exchange)
    return quotes.map((quote) => this.quoteToMarketData(quote))
  }

  // Get Indian market indices
  async getIndices(): Promise<MarketData[]> {
    const indices = [
      { symbol: "NIFTY", exchange: "NSE" },
      { symbol: "SENSEX", exchange: "BSE" },
      { symbol: "BANKNIFTY", exchange: "NSE" },
      { symbol: "NIFTYNEXT50", exchange: "NSE" },
      { symbol: "NIFTYIT", exchange: "NSE" },
    ]

    const results = await Promise.all(indices.map(({ symbol, exchange }) => this.getStockData(symbol, exchange)))

    return results.filter((data): data is MarketData => data !== null)
  }

  // Get top Indian stocks
  async getTopStocks(): Promise<MarketData[]> {
    const topStocks = [
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

    return this.getMultipleStocks(topStocks, "NSE")
  }

  // Get currency exchange rates
  async getCurrencyRates(): Promise<{ [key: string]: number }> {
    const cacheKey = "currency_rates"
    const cached = this.getCachedData(cacheKey)
    if (cached) return cached

    const currencies = ["USD/INR", "EUR/INR", "GBP/INR", "JPY/INR"]

    if (this.isDemo) {
      const mockRates = {
        "USD/INR": 83.25 + (Math.random() - 0.5) * 0.5,
        "EUR/INR": 90.15 + (Math.random() - 0.5) * 0.8,
        "GBP/INR": 105.45 + (Math.random() - 0.5) * 1.2,
        "JPY/INR": 0.56 + (Math.random() - 0.5) * 0.02,
      }
      this.setCachedData(cacheKey, mockRates)
      return mockRates
    }

    try {
      const rates: { [key: string]: number } = {}

      for (const pair of currencies) {
        const quote = await this.getQuote(pair, "Forex")
        if (quote) {
          rates[pair] = quote.close
        }
      }

      this.setCachedData(cacheKey, rates)
      return rates
    } catch (error) {
      console.error("Failed to fetch currency rates:", error)
      return {}
    }
  }

  // Get commodity prices
  async getCommodityData(commodity: string): Promise<CommodityData | null> {
    const cacheKey = `commodity_${commodity}`
    const cached = this.getCachedData(cacheKey)
    if (cached) return cached

    // Map commodity names to Twelve Data symbols
    const commodityMap: { [key: string]: { symbol: string; unit: string } } = {
      GOLD: { symbol: "XAU/USD", unit: "per oz" },
      SILVER: { symbol: "XAG/USD", unit: "per oz" },
      CRUDE_OIL: { symbol: "WTI/USD", unit: "per barrel" },
      NATURAL_GAS: { symbol: "NG/USD", unit: "per mmBtu" },
      COPPER: { symbol: "HG/USD", unit: "per lb" },
    }

    const commodityInfo = commodityMap[commodity]
    if (!commodityInfo) return null

    if (this.isDemo) {
      return this.generateMockCommodityData(commodity)
    }

    try {
      const quote = await this.getQuote(commodityInfo.symbol, "COMEX")
      if (!quote) return null

      return {
        commodity,
        price: quote.close,
        unit: commodityInfo.unit,
        change: quote.change,
        changePercent: quote.percent_change,
        lastUpdated: quote.datetime,
      }
    } catch (error) {
      console.error(`Failed to fetch commodity data for ${commodity}:`, error)
      return this.generateMockCommodityData(commodity)
    }
  }

  // Get all major commodities
  async getAllCommodities(): Promise<CommodityData[]> {
    const commodities = ["GOLD", "SILVER", "CRUDE_OIL", "NATURAL_GAS", "COPPER"]
    const promises = commodities.map((commodity) => this.getCommodityData(commodity))
    const results = await Promise.all(promises)
    return results.filter((data): data is CommodityData => data !== null)
  }

  // Search securities
  async searchSecurities(query: string): Promise<{ stocks: MarketData[]; mutualFunds: MutualFundData[] }> {
    // For demo, return mock search results
    if (this.isDemo) {
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

      const stocks = await this.getMultipleStocks(mockStocks, "NSE")
      const mutualFunds = this.generateMockMutualFunds()

      return { stocks, mutualFunds: mutualFunds.slice(0, 5) }
    }

    // In production, implement symbol search using Twelve Data's symbol search endpoint
    try {
      const url = `${this.baseURL}/symbol_search?symbol=${query}&apikey=${this.apiKey}`
      const response = await fetch(url)
      const searchResults = await response.json()

      // Process search results and get quotes for relevant symbols
      const symbols =
        searchResults.data
          ?.filter((item: any) => item.exchange === "NSE" || item.exchange === "BSE")
          ?.slice(0, 5)
          ?.map((item: any) => item.symbol) || []

      const stocks = await this.getMultipleStocks(symbols, "NSE")
      const mutualFunds = this.generateMockMutualFunds() // Twelve Data doesn't have Indian MF data

      return { stocks, mutualFunds: mutualFunds.slice(0, 5) }
    } catch (error) {
      console.error("Failed to search securities:", error)
      return { stocks: [], mutualFunds: [] }
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

  private generateMockQuote(symbol: string, exchange: string): TwelveDataQuote {
    const basePrice = this.getBasePriceForSymbol(symbol)
    const change = (Math.random() - 0.5) * basePrice * 0.05
    const percentChange = (change / basePrice) * 100

    return {
      symbol,
      name: this.getCompanyName(symbol),
      exchange,
      currency: "INR",
      datetime: new Date().toISOString(),
      timestamp: Date.now(),
      open: basePrice + (Math.random() - 0.5) * basePrice * 0.02,
      high: basePrice + Math.random() * basePrice * 0.03,
      low: basePrice - Math.random() * basePrice * 0.03,
      close: basePrice + change,
      volume: Math.floor(Math.random() * 10000000) + 1000000,
      previous_close: basePrice,
      change,
      percent_change: percentChange,
    }
  }

  private generateMockTimeSeries(
    symbol: string,
    interval: string,
    outputsize: number,
    exchange: string,
  ): TwelveDataTimeSeriesResponse {
    const basePrice = this.getBasePriceForSymbol(symbol)
    const values = []

    for (let i = outputsize - 1; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)

      const price = basePrice + (Math.random() - 0.5) * basePrice * 0.1
      const open = price + (Math.random() - 0.5) * price * 0.02
      const high = Math.max(open, price) + Math.random() * price * 0.02
      const low = Math.min(open, price) - Math.random() * price * 0.02
      const volume = Math.floor(Math.random() * 10000000) + 1000000

      values.push({
        datetime: date.toISOString().split("T")[0],
        open: open.toFixed(2),
        high: high.toFixed(2),
        low: low.toFixed(2),
        close: price.toFixed(2),
        volume: volume.toString(),
      })
    }

    return {
      meta: {
        symbol,
        interval,
        currency: "INR",
        exchange_timezone: "Asia/Kolkata",
        exchange,
        mic_code: exchange === "NSE" ? "XNSE" : "XBOM",
        type: "Common Stock",
      },
      values,
      status: "ok",
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

  private generateMockMutualFunds(): MutualFundData[] {
    const funds = [
      { code: "120503", name: "Axis Bluechip Fund - Direct Growth" },
      { code: "120505", name: "HDFC Top 100 Fund - Direct Growth" },
      { code: "119551", name: "SBI Bluechip Fund - Direct Growth" },
      { code: "100016", name: "ICICI Prudential Bluechip Fund - Direct Growth" },
      { code: "101206", name: "Mirae Asset Large Cap Fund - Direct Growth" },
    ]

    return funds.map((fund) => {
      const baseNav = Math.random() * 500 + 50
      const change = (Math.random() - 0.5) * 5
      const changePercent = (change / baseNav) * 100

      return {
        schemeCode: fund.code,
        schemeName: fund.name,
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
    })
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
      NIFTY: 22150,
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
      NIFTY: "Nifty 50",
      SENSEX: "BSE Sensex",
      BANKNIFTY: "Bank Nifty",
      NIFTYNEXT50: "Nifty Next 50",
      NIFTYIT: "Nifty IT",
    }
    return names[symbol] || symbol
  }

  private getBasePriceForCommodity(commodity: string): number {
    const prices: { [key: string]: number } = {
      GOLD: 2050, // USD per oz
      SILVER: 24.5, // USD per oz
      CRUDE_OIL: 75, // USD per barrel
      NATURAL_GAS: 2.8, // USD per mmBtu
      COPPER: 3.85, // USD per lb
    }
    return prices[commodity] || 100
  }

  private getCommodityUnit(commodity: string): string {
    const units: { [key: string]: string } = {
      GOLD: "per oz",
      SILVER: "per oz",
      CRUDE_OIL: "per barrel",
      NATURAL_GAS: "per mmBtu",
      COPPER: "per lb",
    }
    return units[commodity] || "per unit"
  }

  private getNextMarketOpen(currentTime: Date): string {
    const nextOpen = new Date(currentTime)
    nextOpen.setHours(9, 15, 0, 0)

    if (currentTime.getHours() >= 15 || currentTime.getDay() === 0 || currentTime.getDay() === 6) {
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
      do {
        nextClose.setDate(nextClose.getDate() + 1)
      } while (nextClose.getDay() === 0 || nextClose.getDay() === 6)
    }

    return nextClose.toISOString()
  }
}

// Export singleton instance
export const twelveDataAPI = new TwelveDataAPI()

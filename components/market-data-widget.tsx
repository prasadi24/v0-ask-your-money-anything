"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, IndianRupee, Activity } from "lucide-react"

interface MarketData {
  nifty50: { value: number; change: number; changePercent: number }
  sensex: { value: number; change: number; changePercent: number }
  goldPrice: { value: number; change: number; changePercent: number }
  usdInr: { value: number; change: number; changePercent: number }
}

export function MarketDataWidget() {
  const [marketData, setMarketData] = useState<MarketData>({
    nifty50: { value: 22150.45, change: 125.3, changePercent: 0.57 },
    sensex: { value: 73142.8, change: 418.5, changePercent: 0.58 },
    goldPrice: { value: 62450, change: 245, changePercent: 0.39 },
    usdInr: { value: 83.25, change: -0.15, changePercent: -0.18 },
  })

  const [lastUpdated, setLastUpdated] = useState(new Date())

  // Simulate real-time updates (in production, this would connect to actual APIs)
  useEffect(() => {
    const interval = setInterval(() => {
      setMarketData((prev) => ({
        nifty50: {
          ...prev.nifty50,
          value: prev.nifty50.value + (Math.random() - 0.5) * 20,
          change: prev.nifty50.change + (Math.random() - 0.5) * 10,
          changePercent: prev.nifty50.changePercent + (Math.random() - 0.5) * 0.2,
        },
        sensex: {
          ...prev.sensex,
          value: prev.sensex.value + (Math.random() - 0.5) * 100,
          change: prev.sensex.change + (Math.random() - 0.5) * 50,
          changePercent: prev.sensex.changePercent + (Math.random() - 0.5) * 0.2,
        },
        goldPrice: {
          ...prev.goldPrice,
          value: prev.goldPrice.value + (Math.random() - 0.5) * 100,
          change: prev.goldPrice.change + (Math.random() - 0.5) * 50,
          changePercent: prev.goldPrice.changePercent + (Math.random() - 0.5) * 0.3,
        },
        usdInr: {
          ...prev.usdInr,
          value: prev.usdInr.value + (Math.random() - 0.5) * 0.2,
          change: prev.usdInr.change + (Math.random() - 0.5) * 0.1,
          changePercent: prev.usdInr.changePercent + (Math.random() - 0.5) * 0.1,
        },
      }))
      setLastUpdated(new Date())
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const formatValue = (value: number, decimals = 2) => {
    return value.toFixed(decimals)
  }

  const getChangeColor = (change: number) => {
    return change >= 0 ? "text-green-600" : "text-red-600"
  }

  const getChangeIcon = (change: number) => {
    return change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-blue-600" />
            <span>Live Market Data</span>
          </div>
          <Badge variant="outline" className="text-xs">
            Updated: {lastUpdated.toLocaleTimeString()}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Nifty 50 */}
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-sm font-medium text-gray-600 mb-1">NIFTY 50</div>
            <div className="text-lg font-bold">{formatValue(marketData.nifty50.value)}</div>
            <div
              className={`text-sm flex items-center justify-center space-x-1 ${getChangeColor(marketData.nifty50.change)}`}
            >
              {getChangeIcon(marketData.nifty50.change)}
              <span>
                {formatValue(marketData.nifty50.change)} ({formatValue(marketData.nifty50.changePercent)}%)
              </span>
            </div>
          </div>

          {/* Sensex */}
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-sm font-medium text-gray-600 mb-1">SENSEX</div>
            <div className="text-lg font-bold">{formatValue(marketData.sensex.value)}</div>
            <div
              className={`text-sm flex items-center justify-center space-x-1 ${getChangeColor(marketData.sensex.change)}`}
            >
              {getChangeIcon(marketData.sensex.change)}
              <span>
                {formatValue(marketData.sensex.change)} ({formatValue(marketData.sensex.changePercent)}%)
              </span>
            </div>
          </div>

          {/* Gold Price */}
          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <div className="text-sm font-medium text-gray-600 mb-1">Gold (10g)</div>
            <div className="text-lg font-bold flex items-center justify-center">
              <IndianRupee className="h-4 w-4" />
              {formatValue(marketData.goldPrice.value, 0)}
            </div>
            <div
              className={`text-sm flex items-center justify-center space-x-1 ${getChangeColor(marketData.goldPrice.change)}`}
            >
              {getChangeIcon(marketData.goldPrice.change)}
              <span>
                {formatValue(marketData.goldPrice.change, 0)} ({formatValue(marketData.goldPrice.changePercent)}%)
              </span>
            </div>
          </div>

          {/* USD/INR */}
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-sm font-medium text-gray-600 mb-1">USD/INR</div>
            <div className="text-lg font-bold flex items-center justify-center">
              <IndianRupee className="h-4 w-4" />
              {formatValue(marketData.usdInr.value)}
            </div>
            <div
              className={`text-sm flex items-center justify-center space-x-1 ${getChangeColor(marketData.usdInr.change)}`}
            >
              {getChangeIcon(marketData.usdInr.change)}
              <span>
                {formatValue(marketData.usdInr.change)} ({formatValue(marketData.usdInr.changePercent)}%)
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 text-xs text-gray-500 text-center">
          Data provided for demonstration. In production, integrate with NSE/BSE APIs for real-time data.
        </div>
      </CardContent>
    </Card>
  )
}

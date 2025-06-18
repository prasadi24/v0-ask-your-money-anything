import { MarketSetupGuide } from "@/components/market-setup-guide"

export default function MarketSetupPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Market Data API Setup</h1>
          <p className="text-gray-600">
            Configure your market data provider for real-time stock, mutual fund, and commodity data.
          </p>
        </div>

        <MarketSetupGuide />
      </div>
    </div>
  )
}

import { TwelveDataSetup } from "@/components/twelve-data-setup"

export default function TwelveDataPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Twelve Data Integration</h1>
          <p className="text-gray-600">
            Set up Twelve Data API for real-time Indian market data with generous free tier.
          </p>
        </div>

        <TwelveDataSetup />
      </div>
    </div>
  )
}

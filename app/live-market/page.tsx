import { Logo } from "@/components/logo"

const LiveMarketPage = () => {
  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center space-x-3 mb-6">
        <Logo variant="icon" size="md" />
        <h1 className="text-3xl font-bold text-navy-800">Live Market Data</h1>
      </div>
      {/* Rest of the page content will go here */}
      <p>This is where the live market data will be displayed.</p>
    </div>
  )
}

export default LiveMarketPage

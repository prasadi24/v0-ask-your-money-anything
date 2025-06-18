import { Logo } from "@/components/ui/logo"

const RiskAnalyzerPage = () => {
  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center space-x-3 mb-6">
        <Logo variant="icon" size="md" />
        <h1 className="text-3xl font-bold text-navy-800">Risk Analyzer</h1>
      </div>
      {/* Rest of the page content goes here */}
      <p>This is the Risk Analyzer page.</p>
    </div>
  )
}

export default RiskAnalyzerPage

import { Logo } from "@/components/logo"

export default function FinancialNewsPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center space-x-3 mb-6">
        <Logo variant="icon" size="md" />
        <h1 className="text-3xl font-bold text-navy-800">Financial News</h1>
      </div>
      {/* rest of code here */}
    </div>
  )
}

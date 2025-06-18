import { Logo } from "@/components/ui/logo"

export default function AdminPage() {
  return (
    <div className="container py-10">
      <div className="flex items-center space-x-3 mb-6">
        <Logo variant="icon" size="md" />
        <h1 className="text-3xl font-bold text-navy-800">Admin Dashboard</h1>
      </div>
      {/* rest of code here */}
    </div>
  )
}

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Brain, Database, Shield, Zap } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">FinGPT</h1>
          </div>
          <nav className="flex items-center space-x-4">
            <Link href="/ask">
              <Button variant="ghost">Ask Questions</Button>
            </Link>
            <Link href="/admin">
              <Button variant="ghost">Admin</Button>
            </Link>
            <Button>Sign In</Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Ask Your Money{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600">Anything</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Get instant, intelligent answers about investments, real estate, mutual funds, and financial planning
            powered by AI and real-time data.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/ask">
              <Button size="lg" className="text-lg px-8 py-3">
                Start Asking Questions
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8 py-3">
              View Sample Questions
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Powered by Advanced AI Technology</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our RAG-powered system analyzes thousands of financial documents to provide accurate, up-to-date answers to
            your financial questions.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <Brain className="h-10 w-10 text-blue-600 mb-2" />
              <CardTitle>AI-Powered Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Advanced GPT-4 model analyzes complex financial data and provides intelligent insights tailored to your
                questions.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Database className="h-10 w-10 text-green-600 mb-2" />
              <CardTitle>Real-Time Data</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Access to live market data, mutual fund performance, real estate trends, and government financial
                reports.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="h-10 w-10 text-purple-600 mb-2" />
              <CardTitle>Secure & Private</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Your financial queries are processed securely with enterprise-grade encryption and privacy protection.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Zap className="h-10 w-10 text-orange-600 mb-2" />
              <CardTitle>Instant Answers</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Get comprehensive answers in seconds, backed by verified financial documents and real-time market data.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Sample Questions */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Can You Ask?</h2>
            <p className="text-lg text-gray-600">Here are some examples of questions FinGPT can answer</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              "How did Axis Bluechip Fund perform in the last 5 years?",
              "What are the current gold prices and trends?",
              "Should I invest in Amaravati real estate now?",
              "Compare SIP vs lump sum for HDFC Top 100 Fund",
              "What are the tax implications of selling mutual funds?",
              "Which LIC policy offers the best returns?",
            ].map((question, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <p className="text-gray-700 font-medium">"{question}"</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/ask">
              <Button size="lg">
                Try These Questions
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Brain className="h-6 w-6" />
                <span className="text-xl font-bold">FinGPT</span>
              </div>
              <p className="text-gray-400">Your intelligent financial assistant powered by AI.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Features</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Investment Analysis</li>
                <li>Real Estate Insights</li>
                <li>Mutual Fund Research</li>
                <li>Tax Planning</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Documentation</li>
                <li>API Reference</li>
                <li>Sample Questions</li>
                <li>Support</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>About Us</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Contact</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 FinGPT. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

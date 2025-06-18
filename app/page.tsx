import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowRight,
  Brain,
  Database,
  Shield,
  Zap,
  CheckCircle,
  Star,
  TrendingUp,
  Users,
  MessageSquare,
  IndianRupee,
  Coins,
} from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-artha-50 via-white to-indigo-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Coins className="h-8 w-8 text-artha-500" />
            <h1 className="text-2xl font-bold text-indigo-800">ArthaGPT</h1>
            <Badge variant="outline" className="ml-2 border-artha-300 text-artha-700">
              Beta
            </Badge>
          </div>
          <nav className="flex items-center space-x-4">
            <Link href="/ask">
              <Button variant="ghost">Try Demo</Button>
            </Link>
            <Link href="/pricing">
              <Button variant="ghost">Pricing</Button>
            </Link>
            <Link href="/admin">
              <Button variant="ghost">Admin</Button>
            </Link>
            <Button className="bg-indigo-800 hover:bg-indigo-900 text-white">Get Started Free</Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge variant="outline" className="mb-4 border-artha-300 text-artha-700">
            🚀 Your Financial Wisdom Assistant
          </Badge>

          <h1 className="text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Decode Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-artha-500 to-indigo-800">Wealth</span>
          </h1>

          <p className="text-2xl text-artha-600 font-medium mb-4">Ask ArthaGPT.</p>

          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Get instant, intelligent answers about investments, real estate, mutual funds, and financial planning
            powered by AI and real-time Indian market data. Let AI decode your investments.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/ask">
              <Button size="lg" className="text-lg px-8 py-4 h-auto bg-indigo-800 hover:bg-indigo-900">
                Ask. Understand. Prosper.
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-4 h-auto border-artha-400 text-artha-700 hover:bg-artha-50"
            >
              Watch Demo
            </Button>
          </div>

          {/* Social Proof */}
          <div className="flex items-center justify-center space-x-8 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>1,000+ investors trust ArthaGPT</span>
            </div>
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-4 w-4" />
              <span>10,000+ questions answered</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="h-4 w-4 text-artha-500" />
              <span>4.9/5 user rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Powered by Advanced AI Technology</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our RAG-powered system analyzes thousands of financial documents to provide accurate, up-to-date answers to
            your financial questions.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <Brain className="h-12 w-12 text-indigo-600 mb-4" />
              <CardTitle className="text-xl">AI-Powered Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Advanced GPT-4 model analyzes complex financial data and provides intelligent insights tailored to
                Indian markets and your specific questions.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <Database className="h-12 w-12 text-artha-600 mb-4" />
              <CardTitle className="text-xl">Real-Time Data</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Access to live market data, mutual fund NAVs, gold prices, real estate trends, and government financial
                reports updated daily.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <Shield className="h-12 w-12 text-indigo-600 mb-4" />
              <CardTitle className="text-xl">Secure & Private</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Your financial queries are processed securely with enterprise-grade encryption and privacy protection.
                Your data never leaves our secure servers.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <Zap className="h-12 w-12 text-artha-600 mb-4" />
              <CardTitle className="text-xl">Instant Answers</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Get comprehensive answers in seconds, backed by verified financial documents and real-time market data
                with proper source citations.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Use Cases */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Perfect for Every Financial Decision</h2>
            <p className="text-xl text-gray-600">
              From beginners to experts, ArthaGPT helps everyone make better financial choices
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <TrendingUp className="h-10 w-10 text-indigo-600 mb-4" />
                <CardTitle className="text-xl">Investment Planning</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Mutual fund analysis and comparison</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">SIP vs lump sum recommendations</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Risk assessment and portfolio optimization</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Tax-saving investment strategies</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <IndianRupee className="h-10 w-10 text-artha-600 mb-4" />
                <CardTitle className="text-xl">Market Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">RBI-reported gold and commodity prices</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">SEBI-regulated stock market trends</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Economic indicators and RBI policy impact</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">NSE/BSE sector-wise performance</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <Shield className="h-10 w-10 text-indigo-600 mb-4" />
                <CardTitle className="text-xl">Insurance & Planning</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">IRDA-approved LIC and ULIP policies</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Term insurance recommendations</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">NPS and PPF retirement planning</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Emergency fund calculations</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Sample Questions */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Can You Ask?</h2>
            <p className="text-xl text-gray-600">Here are some examples of questions ArthaGPT can answer instantly</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              "How did Axis Bluechip Fund perform in the last 5 years?",
              "What are the current gold prices as per RBI data?",
              "Should I invest in Amaravati real estate in 2024?",
              "Compare SIP vs lump sum for HDFC Top 100 Fund",
              "What are the tax implications under LTCG for mutual funds?",
              "Which LIC policy offers the best returns for 10 years?",
              "How to build a ₹1 crore retirement corpus with PPF and NPS?",
              "Best tax-saving investments under Section 80C",
              "SEBI's new mutual fund categorization: small cap or large cap?",
            ].map((question, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-artha-500"
              >
                <CardContent className="p-6">
                  <p className="text-gray-700 font-medium">"{question}"</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/ask">
              <Button size="lg" className="text-lg px-8 py-4 h-auto bg-indigo-800 hover:bg-indigo-900">
                Try These Questions
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-indigo-800 to-indigo-600 py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-6">Ready to Decode Your Wealth?</h2>
            <p className="text-xl text-indigo-100 mb-8">
              Join thousands of investors who trust ArthaGPT for their financial planning. Start with our free tier and
              upgrade as you grow.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/ask">
                <Button
                  size="lg"
                  className="text-lg px-8 py-4 h-auto bg-artha-500 text-indigo-900 hover:bg-artha-400 hover:text-indigo-800"
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button
                size="lg"
                className="text-lg px-8 py-4 h-auto bg-white text-indigo-800 hover:bg-gray-100 hover:text-indigo-900 border-0"
              >
                Schedule Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-5 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-6">
                <Coins className="h-8 w-8 text-artha-500" />
                <span className="text-2xl font-bold">ArthaGPT</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Your intelligent financial wisdom assistant powered by AI. Making complex financial decisions simple and
                accessible for everyone in India.
              </p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  Twitter
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  LinkedIn
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  YouTube
                </Button>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <Link href="/ask" className="hover:text-white">
                    Ask Questions
                  </Link>
                </li>
                <li>
                  <Link href="/features" className="hover:text-white">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-white">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/api" className="hover:text-white">
                    API
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <Link href="/docs" className="hover:text-white">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-white">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/guides" className="hover:text-white">
                    Investment Guides
                  </Link>
                </li>
                <li>
                  <Link href="/support" className="hover:text-white">
                    Support
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <Link href="/about" className="hover:text-white">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="hover:text-white">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              &copy; 2024 ArthaGPT. All rights reserved. Made with ❤️ for Indian investors.
            </p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <Badge variant="outline" className="text-gray-400 border-gray-600">
                🇮🇳 Made in India
              </Badge>
              <Badge variant="outline" className="text-gray-400 border-gray-600">
                🔒 SOC 2 Compliant
              </Badge>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

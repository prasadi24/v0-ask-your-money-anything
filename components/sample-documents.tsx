"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Plus } from "lucide-react"
import { freeVectorStore } from "@/lib/free-vector-store"

const sampleDocuments = [
  {
    name: "Axis Bluechip Fund Factsheet March 2024.pdf",
    type: "Mutual Fund",
    content: `
AXIS BLUECHIP FUND - FACTSHEET MARCH 2024

Fund Overview:
- Fund Name: Axis Bluechip Fund
- Category: Large Cap Equity Fund
- Benchmark: Nifty 100 TRI
- Fund Manager: Shreyash Devalkar
- Launch Date: January 1, 2010
- AUM: ₹15,247 crores (as of March 2024)

Performance (as of March 31, 2024):
- 1 Year Return: 28.45%
- 3 Year Return (CAGR): 15.23%
- 5 Year Return (CAGR): 13.18%
- Since Inception (CAGR): 14.67%

Fund Details:
- Expense Ratio: 1.82%
- Exit Load: 1% if redeemed within 1 year
- Minimum Investment: ₹500 (SIP), ₹5,000 (Lumpsum)
- Risk Level: Moderate to High

Top Holdings (March 2024):
1. Reliance Industries Ltd - 8.45%
2. HDFC Bank Ltd - 7.23%
3. Infosys Ltd - 6.78%
4. ICICI Bank Ltd - 5.92%
5. TCS Ltd - 5.34%

Sector Allocation:
- Financial Services: 32.45%
- Information Technology: 18.67%
- Oil & Gas: 12.34%
- Consumer Goods: 8.92%
- Healthcare: 7.45%

Investment Objective:
To generate long-term capital appreciation by investing predominantly in equity and equity related securities of large cap companies.

Risk Factors:
- Market risk due to equity exposure
- Concentration risk in large cap stocks
- Liquidity risk during market stress
- Interest rate risk affecting valuations
    `,
  },
  {
    name: "Gold Price Report RBI Q1 2024.pdf",
    type: "Commodity",
    content: `
GOLD PRICE ANALYSIS - RBI QUARTERLY REPORT Q1 2024

Executive Summary:
Gold prices in India witnessed significant volatility during Q1 2024, influenced by global economic uncertainties, inflation concerns, and geopolitical tensions.

Current Gold Prices (March 31, 2024):
- 24K Gold: ₹6,245 per gram
- 22K Gold: ₹5,725 per gram
- 18K Gold: ₹4,684 per gram
- Gold ETF: ₹6,198 per gram

Price Movement Analysis:
- Q1 2024 Return: +12.3%
- YoY Return: +15.7%
- 3-Year CAGR: +8.9%
- 5-Year CAGR: +11.2%

Factors Affecting Gold Prices:
1. Global inflation concerns
2. US Federal Reserve policy changes
3. Geopolitical tensions (Russia-Ukraine, Middle East)
4. Indian rupee depreciation
5. Domestic demand patterns

Import Data:
- Q1 2024 Gold Imports: 285 tonnes
- Previous Quarter: 312 tonnes
- YoY Change: -8.6%

Demand Analysis:
- Jewelry Demand: 68% of total demand
- Investment Demand: 22% of total demand
- Industrial Demand: 10% of total demand

Regional Price Variations:
- Mumbai: ₹6,245 per gram
- Delhi: ₹6,255 per gram
- Chennai: ₹6,240 per gram
- Kolkata: ₹6,250 per gram

Investment Options:
1. Physical Gold (coins, bars, jewelry)
2. Gold ETFs (expense ratio: 0.5-1%)
3. Gold Mutual Funds
4. Digital Gold platforms
5. Gold bonds (Government)

Outlook:
RBI expects gold prices to remain volatile in Q2 2024, with potential for further upside if global uncertainties persist.
    `,
  },
  {
    name: "Amaravati Real Estate Market Report 2024.pdf",
    type: "Real Estate",
    content: `
AMARAVATI REAL ESTATE MARKET ANALYSIS 2024

Market Overview:
Amaravati, the planned capital city of Andhra Pradesh, continues to show promising growth potential despite regulatory and political challenges.

Current Market Prices (March 2024):
- Residential Land: ₹4,500-8,500 per sq ft
- Commercial Land: ₹12,000-25,000 per sq ft
- Apartment Prices: ₹3,200-5,800 per sq ft
- Villa Prices: ₹4,800-9,200 per sq ft

Price Trends:
- YoY Growth: +8.2%
- 3-Year CAGR: +6.7%
- Peak Price (2017): ₹15,000 per sq ft
- Current Recovery: 45% from peak

Key Development Areas:
1. Seed Access Road: ₹6,500-8,500 per sq ft
2. Vijayawada-Amaravati Road: ₹5,200-7,200 per sq ft
3. Mangalagiri: ₹4,500-6,500 per sq ft
4. Tadepalli: ₹5,800-8,200 per sq ft

Infrastructure Development:
- Metro Rail Project: Under planning
- Amaravati Airport: Proposed
- Government Complex: 40% complete
- Road Connectivity: Improving

Investment Considerations:
Positive Factors:
- Capital city status
- Government backing
- Strategic location
- Infrastructure development

Risk Factors:
- Political uncertainty
- Regulatory delays
- Market liquidity concerns
- Construction timeline delays

Rental Yields:
- Residential: 2.5-4.2% annually
- Commercial: 6.8-9.5% annually

Comparison with Other Cities:
- Hyderabad: ₹8,500-15,000 per sq ft
- Bangalore: ₹9,200-18,500 per sq ft
- Chennai: ₹7,800-14,200 per sq ft
- Amaravati: ₹4,500-8,500 per sq ft

Future Outlook:
Market experts predict 10-15% annual growth over the next 5 years, subject to political stability and infrastructure completion.

Investment Recommendation:
Suitable for long-term investors (5+ years) with moderate to high risk tolerance. Focus on areas with confirmed infrastructure development.
    `,
  },
]

export function SampleDocuments() {
  const [loading, setLoading] = useState<string | null>(null)

  const addSampleDocument = async (doc: (typeof sampleDocuments)[0]) => {
    setLoading(doc.name)
    try {
      await freeVectorStore.addDocument(doc.content, {
        source: doc.name,
        type: doc.type,
      })

      // Trigger a refresh of the admin dashboard
      window.dispatchEvent(new Event("documentsUpdated"))

      alert(`Successfully added ${doc.name} to the knowledge base!`)
    } catch (error) {
      console.error("Error adding document:", error)
      alert("Failed to add document. Please try again.")
    } finally {
      setLoading(null)
    }
  }

  const addAllSamples = async () => {
    setLoading("all")
    try {
      for (const doc of sampleDocuments) {
        await freeVectorStore.addDocument(doc.content, {
          source: doc.name,
          type: doc.type,
        })
      }

      window.dispatchEvent(new Event("documentsUpdated"))
      alert("Successfully added all sample documents!")
    } catch (error) {
      console.error("Error adding documents:", error)
      alert("Failed to add some documents. Please try again.")
    } finally {
      setLoading(null)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Sample Financial Documents</CardTitle>
            <CardDescription>Add these sample documents to test FinGPT's capabilities</CardDescription>
          </div>
          <Button onClick={addAllSamples} disabled={loading === "all"}>
            <Plus className="h-4 w-4 mr-2" />
            {loading === "all" ? "Adding All..." : "Add All Samples"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-1 gap-4">
          {sampleDocuments.map((doc, index) => (
            <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <FileText className="h-8 w-8 text-blue-600" />
                <div>
                  <h3 className="font-medium">{doc.name}</h3>
                  <p className="text-sm text-gray-600">Sample {doc.type} document with real financial data</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline">{doc.type}</Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addSampleDocument(doc)}
                  disabled={loading === doc.name}
                >
                  {loading === doc.name ? "Adding..." : "Add to KB"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

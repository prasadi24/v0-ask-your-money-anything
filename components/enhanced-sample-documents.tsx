"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, TrendingUp, IndianRupee, Home, Shield } from "lucide-react"
import { enhancedRAG } from "@/lib/enhanced-rag"

const comprehensiveDocuments = [
  {
    name: "HDFC Top 100 Fund Detailed Analysis 2024.pdf",
    type: "Mutual Fund",
    category: "mutual_fund" as const,
    icon: TrendingUp,
    content: `
HDFC TOP 100 FUND - COMPREHENSIVE PERFORMANCE ANALYSIS 2024

Fund Overview:
- Fund Name: HDFC Top 100 Fund
- SEBI Category: Large Cap Equity Fund
- Benchmark: Nifty 100 TRI
- Fund Manager: Chirag Setalvad (since 2019)
- Launch Date: October 1, 1996
- AUM: ₹18,456 crores (March 2024)
- Fund House: HDFC Asset Management Company

Performance Analysis (March 31, 2024):
- 1 Year Return: 26.78% (vs Nifty 100: 24.12%)
- 3 Year CAGR: 16.45% (vs Nifty 100: 13.87%)
- 5 Year CAGR: 14.23% (vs Nifty 100: 11.95%)
- 10 Year CAGR: 13.89% (vs Nifty 100: 12.45%)
- Since Inception CAGR: 15.67%

Risk Metrics:
- Standard Deviation (3Y): 17.2%
- Beta (3Y): 0.98
- Sharpe Ratio (3Y): 0.85
- Alpha (3Y): 2.34%
- Maximum Drawdown: -38.2% (March 2020)

Fund Details:
- Expense Ratio: 1.75% (Direct), 2.25% (Regular)
- Exit Load: 1% if redeemed within 1 year
- Minimum SIP: ₹500 per month
- Minimum Lumpsum: ₹5,000
- Portfolio Turnover: 28% (Moderate)

Top 10 Holdings (March 2024):
1. Reliance Industries Ltd - 9.12% (Oil & Gas)
2. HDFC Bank Ltd - 8.45% (Private Banking)
3. Infosys Ltd - 7.23% (IT Services)
4. ICICI Bank Ltd - 6.78% (Private Banking)
5. TCS Ltd - 6.34% (IT Services)
6. Hindustan Unilever Ltd - 4.89% (FMCG)
7. ITC Ltd - 4.12% (Consumer Goods)
8. Kotak Mahindra Bank - 3.98% (Private Banking)
9. Bajaj Finance Ltd - 3.67% (NBFC)
10. Asian Paints Ltd - 3.45% (Paints)

Sector Allocation vs Benchmark:
- Financial Services: 34.2% (Benchmark: 35.8%)
- Information Technology: 19.8% (Benchmark: 16.2%)
- Oil & Gas: 11.4% (Benchmark: 10.8%)
- Consumer Goods: 9.7% (Benchmark: 8.9%)
- Healthcare: 6.8% (Benchmark: 5.4%)
- Automobile: 4.3% (Benchmark: 4.8%)
- Metals: 3.9% (Benchmark: 4.2%)
- Others: 9.9% (Benchmark: 13.9%)

SIP vs Lumpsum Analysis:
SIP Investment (₹10,000/month for 10 years):
- Total Investment: ₹12,00,000
- Current Value: ₹23,45,678
- Returns: ₹11,45,678 (95.47%)
- XIRR: 14.23%

Lumpsum Investment (₹12,00,000 in 2014):
- Investment Amount: ₹12,00,000
- Current Value: ₹44,67,890
- Returns: ₹32,67,890 (272.32%)
- CAGR: 14.23%

Tax Implications:
- LTCG Tax: 10% on gains above ₹1 lakh (holding > 1 year)
- STCG Tax: 15% (holding < 1 year)
- Dividend Distribution Tax: Nil (taxable in hands of investor)
- Securities Transaction Tax: 0.001% on redemption

Fund Manager Profile:
Chirag Setalvad - CFA, MBA Finance
- Experience: 15+ years in equity research and fund management
- Previous Role: Senior Fund Manager at HDFC AMC
- Investment Philosophy: Quality growth at reasonable price (GARP)
- Track Record: Consistently outperformed benchmark

Investment Recommendation:
Suitable for:
- Long-term wealth creation (5+ years)
- Investors with moderate to high risk appetite
- First-time equity investors (via SIP route)
- Core portfolio allocation (30-40% of equity allocation)

Not suitable for:
- Short-term investors (< 3 years)
- Conservative investors seeking guaranteed returns
- Investors looking for high dividend yield

Comparison with Peers:
vs Axis Bluechip Fund:
- HDFC: 14.23% (5Y CAGR) vs Axis: 13.18%
- HDFC: 1.75% (Expense) vs Axis: 1.82%
- HDFC: ₹18,456 cr (AUM) vs Axis: ₹15,247 cr

vs ICICI Pru Bluechip Fund:
- HDFC: 14.23% (5Y CAGR) vs ICICI: 12.89%
- HDFC: 1.75% (Expense) vs ICICI: 1.95%
- HDFC: Better risk-adjusted returns

Risk Factors:
- Market risk due to equity exposure
- Concentration risk in large-cap stocks
- Interest rate sensitivity affecting bank holdings
- Regulatory changes impacting specific sectors
- Currency fluctuation risk for companies with global exposure
    `,
  },
  {
    name: "SBI Gold ETF vs Sovereign Gold Bonds Comparison 2024.pdf",
    type: "Gold Investment",
    category: "gold" as const,
    icon: IndianRupee,
    content: `
COMPREHENSIVE GOLD INVESTMENT ANALYSIS - SBI GOLD ETF vs SOVEREIGN GOLD BONDS 2024

Executive Summary:
This report compares two popular gold investment options in India: SBI Gold ETF and Sovereign Gold Bonds (SGBs), analyzing their performance, tax implications, and suitability for different investor profiles.

SBI GOLD ETF ANALYSIS:

Fund Details:
- Fund Name: SBI Gold Exchange Traded Fund
- Launch Date: March 2009
- AUM: ₹1,247 crores (March 2024)
- Expense Ratio: 0.75% per annum
- Tracking Error: 0.12% (very low)
- Minimum Investment: 1 gram (₹6,245 approx)

Performance (March 2024):
- 1 Year Return: 13.45%
- 3 Year CAGR: 9.78%
- 5 Year CAGR: 11.23%
- 10 Year CAGR: 8.95%
- Since Inception CAGR: 9.67%

Advantages:
- High liquidity (tradeable on NSE/BSE)
- No storage hassles
- Lower expense ratio compared to gold funds
- Demat account integration
- Real-time pricing
- No making charges

Disadvantages:
- Demat account required
- Annual maintenance charges
- No interest income
- STCG/LTCG tax applicable
- Market hours trading only

SOVEREIGN GOLD BONDS (SGB) ANALYSIS:

Bond Details:
- Issuer: Reserve Bank of India (RBI)
- Tenure: 8 years (exit option after 5 years)
- Interest Rate: 2.5% per annum (paid semi-annually)
- Minimum Investment: 1 gram
- Maximum Investment: 4 kg (individual), 20 kg (HUF/Trust)
- Issue Price: Market price ± discount for online applications

Performance Analysis:
SGB Series I (November 2015 - November 2023):
- Issue Price: ₹2,684 per gram
- Maturity Price: ₹6,245 per gram
- Capital Appreciation: 132.7%
- Interest Earned: 2.5% × 8 years = 20%
- Total Return: 152.7%
- CAGR: 12.34%

Current SGB Series (March 2024):
- Issue Price: ₹6,195 per gram (₹50 discount for online)
- Market Price: ₹6,245 per gram
- Interest: 2.5% per annum
- Lock-in: 5 years minimum

Advantages:
- Interest income of 2.5% per annum
- No LTCG tax if held till maturity
- Government backing (sovereign guarantee)
- No storage or insurance costs
- Can be used as collateral for loans
- Tradeable on exchanges after lock-in

Disadvantages:
- 8-year lock-in period
- Limited liquidity in secondary market
- Interest taxable as per income slab
- Issue windows are limited
- Cannot be converted to physical gold

TAX COMPARISON:

SBI Gold ETF:
- STCG (< 3 years): As per income tax slab
- LTCG (> 3 years): 20% with indexation benefit
- No TDS applicable
- Securities Transaction Tax: 0.001%

Sovereign Gold Bonds:
- Interest Income: Taxable as per income slab
- Capital Gains (if sold before maturity): 20% LTCG with indexation
- Capital Gains (if held till maturity): Completely tax-free
- No TDS on interest (if < ₹5,000 per year)

INVESTMENT SCENARIOS:

Scenario 1: ₹1,00,000 investment for 8 years

SBI Gold ETF:
- Investment: ₹1,00,000
- Expected Value (8Y @ 9% CAGR): ₹1,99,256
- LTCG Tax (20% with indexation): ₹15,940
- Net Value: ₹1,83,316
- Net CAGR: 7.8%

Sovereign Gold Bonds:
- Investment: ₹1,00,000
- Interest (8Y @ 2.5%): ₹20,000
- Capital Appreciation: ₹99,256
- Tax on Interest: ₹6,000 (30% slab)
- LTCG Tax: Nil (held till maturity)
- Net Value: ₹2,13,256
- Net CAGR: 9.9%

LIQUIDITY COMPARISON:

SBI Gold ETF:
- Trading Hours: 9:15 AM to 3:30 PM
- Average Daily Volume: ₹15-25 crores
- Bid-Ask Spread: 0.05-0.10%
- Settlement: T+2 days
- Exit: Anytime during market hours

Sovereign Gold Bonds:
- Trading Hours: 9:15 AM to 3:30 PM (after 5 years)
- Average Daily Volume: ₹2-5 crores
- Bid-Ask Spread: 0.20-0.50%
- Settlement: T+2 days
- Exit: After 5 years or at maturity

SUITABILITY ANALYSIS:

Choose SBI Gold ETF if:
- You need high liquidity
- Investment horizon < 5 years
- You want to trade actively
- You prefer lower minimum investment
- You don't want long-term commitment

Choose Sovereign Gold Bonds if:
- You have long-term investment horizon (8+ years)
- You want additional interest income
- You prefer tax-free capital gains
- You want government-backed security
- You can commit to 5-year minimum lock-in

PORTFOLIO ALLOCATION RECOMMENDATION:

Conservative Investors (5-7% gold allocation):
- 70% SGB for long-term stability
- 30% Gold ETF for liquidity needs

Moderate Investors (7-10% gold allocation):
- 60% SGB for tax efficiency
- 40% Gold ETF for flexibility

Aggressive Investors (3-5% gold allocation):
- 50% SGB for diversification
- 50% Gold ETF for tactical allocation

MARKET OUTLOOK:

Factors Supporting Gold Prices:
- Global inflation concerns
- Geopolitical tensions
- Central bank gold purchases
- Rupee depreciation pressure
- Monsoon and festival demand

Risk Factors:
- US Federal Reserve policy changes
- Strengthening US Dollar
- Improvement in global economic conditions
- Reduction in import duties
- Digital currency adoption

Price Targets (12-month horizon):
- Conservative: ₹6,500-7,000 per gram
- Moderate: ₹7,000-7,500 per gram
- Optimistic: ₹7,500-8,000 per gram

CONCLUSION:
Both SBI Gold ETF and Sovereign Gold Bonds have their merits. SGBs are superior for long-term investors due to tax benefits and interest income, while Gold ETFs offer better liquidity and flexibility. A combination approach works best for most investors.
    `,
  },
  {
    name: "Hyderabad vs Bangalore Real Estate Investment Analysis 2024.pdf",
    type: "Real Estate",
    category: "real_estate" as const,
    icon: Home,
    content: `
HYDERABAD vs BANGALORE REAL ESTATE INVESTMENT COMPARISON 2024

EXECUTIVE SUMMARY:
This comprehensive analysis compares real estate investment opportunities in Hyderabad and Bangalore, two major IT hubs in South India, covering market trends, rental yields, infrastructure development, and investment prospects.

HYDERABAD REAL ESTATE MARKET ANALYSIS:

Market Overview:
- Average Property Price: ₹6,500-12,000 per sq ft
- YoY Price Growth: 8.5% (2023-24)
- Total Residential Supply: 45,000 units (2024)
- Absorption Rate: 78% (healthy demand)
- Under Construction: 1,25,000 units

Key Micro-markets:
1. Gachibowli-Kondapur Corridor:
   - Price Range: ₹8,500-15,000 per sq ft
   - Rental Yield: 3.2-4.1%
   - IT Hub proximity
   - Metro connectivity (Phase 2)

2. Kokapet-Narsingi:
   - Price Range: ₹7,200-11,500 per sq ft
   - Rental Yield: 3.5-4.3%
   - Emerging IT corridor
   - Good infrastructure development

3. Kompally-Nizampet:
   - Price Range: ₹5,800-9,200 per sq ft
   - Rental Yield: 4.2-5.1%
   - Affordable housing segment
   - Outer Ring Road connectivity

4. Banjara Hills-Jubilee Hills:
   - Price Range: ₹12,000-25,000 per sq ft
   - Rental Yield: 2.8-3.5%
   - Premium residential area
   - Established locality

Infrastructure Development:
- Hyderabad Metro Phase 2: 116 km extension
- Outer Ring Road: 158 km completed
- Pharma City: ₹21,000 crore investment
- Aerospace SEZ: Shamshabad
- IT Investment: ₹15,000 crore committed

Employment Growth:
- IT/ITeS Employment: 6.5 lakh professionals
- Annual Job Addition: 45,000-50,000
- Major Companies: Microsoft, Google, Amazon, Facebook
- Average IT Salary: ₹8.5 lakh per annum

BANGALORE REAL ESTATE MARKET ANALYSIS:

Market Overview:
- Average Property Price: ₹8,200-16,500 per sq ft
- YoY Price Growth: 6.2% (2023-24)
- Total Residential Supply: 52,000 units (2024)
- Absorption Rate: 72% (moderate demand)
- Under Construction: 1,85,000 units

Key Micro-markets:
1. Whitefield-Marathahalli:
   - Price Range: ₹9,500-18,000 per sq ft
   - Rental Yield: 2.8-3.4%
   - Established IT corridor
   - Metro Phase 2 connectivity

2. Electronic City:
   - Price Range: ₹7,800-13,500 per sq ft
   - Rental Yield: 3.1-3.8%
   - Major IT hub
   - Peripheral location

3. Sarjapur-Bellandur:
   - Price Range: ₹8,500-15,200 per sq ft
   - Rental Yield: 3.0-3.6%
   - Emerging corridor
   - Lake view properties

4. Koramangala-Indiranagar:
   - Price Range: ₹15,000-28,000 per sq ft
   - Rental Yield: 2.5-3.2%
   - Central location
   - Premium segment

Infrastructure Development:
- Namma Metro Phase 2: 72 km under construction
- Peripheral Ring Road: 65 km planned
- Bangalore-Chennai Expressway: Under construction
- New International Airport: Proposed
- IT Parks: Continuous expansion

Employment Growth:
- IT/ITeS Employment: 12.5 lakh professionals
- Annual Job Addition: 65,000-70,000
- Major Companies: Infosys, Wipro, TCS, Accenture
- Average IT Salary: ₹9.8 lakh per annum

COMPARATIVE ANALYSIS:

Price Comparison:
Hyderabad Advantages:
- 20-25% lower property prices
- Better affordability index
- Higher rental yields
- Lower cost of living

Bangalore Advantages:
- Higher capital appreciation potential
- Better resale market
- Premium property options
- Established market

Rental Yield Comparison:
Hyderabad: 3.2-5.1% (Average: 4.1%)
Bangalore: 2.5-3.8% (Average: 3.2%)
Winner: Hyderabad (25% higher yields)

Infrastructure Development:
Hyderabad:
- Faster project execution
- Government support
- Planned city development
- Better traffic management

Bangalore:
- Established infrastructure
- Better connectivity options
- More amenities
- Traffic congestion issues

Employment Opportunities:
Bangalore:
- Larger IT ecosystem
- More MNCs
- Higher salary packages
- Better career growth

Hyderabad:
- Emerging IT hub
- Government initiatives
- Lower attrition rates
- Work-life balance

INVESTMENT SCENARIOS:

Scenario 1: ₹1 Crore Investment (5-year horizon)

Hyderabad (Gachibowli):
- Property Size: 1,000 sq ft (₹10,000/sq ft)
- Rental Income: ₹35,000/month (4.2% yield)
- 5-year Rental: ₹21,00,000
- Capital Appreciation (8% CAGR): ₹46,93,280
- Total Returns: ₹67,93,280
- IRR: 10.8%

Bangalore (Whitefield):
- Property Size: 750 sq ft (₹13,333/sq ft)
- Rental Income: ₹25,000/month (3% yield)
- 5-year Rental: ₹15,00,000
- Capital Appreciation (6% CAGR): ₹33,82,255
- Total Returns: ₹48,82,255
- IRR: 8.2%

TAX IMPLICATIONS:

Rental Income Tax:
- Taxable as per income slab
- Standard deduction: 30% of rental income
- Interest on home loan: Fully deductible
- Property tax: Deductible

Capital Gains Tax:
- STCG (< 2 years): As per income slab
- LTCG (> 2 years): 20% with indexation
- Section 54: Reinvestment exemption
- Section 54EC: Capital gains bonds

LEGAL CONSIDERATIONS:

Hyderabad:
- RERA Registration: Mandatory
- Approval Process: Streamlined
- Title Verification: HMDA records
- Registration Charges: 5% + stamp duty

Bangalore:
- RERA Registration: Mandatory
- Approval Process: Complex
- Title Verification: BDA/BMRDA records
- Registration Charges: 5% + stamp duty

RISK ANALYSIS:

Hyderabad Risks:
- Emerging market volatility
- Dependency on IT sector
- Infrastructure development delays
- Political stability concerns

Bangalore Risks:
- Traffic congestion impact
- Water scarcity issues
- High property prices
- Market saturation in prime areas

INVESTMENT RECOMMENDATIONS:

Choose Hyderabad if:
- You seek higher rental yields
- You have moderate budget (₹50L-1.5Cr)
- You prefer emerging markets
- You want better affordability

Choose Bangalore if:
- You seek capital appreciation
- You have higher budget (₹1Cr+)
- You prefer established markets
- You want better liquidity

Portfolio Approach:
- 60% Hyderabad (rental yield focus)
- 40% Bangalore (capital appreciation focus)

MARKET OUTLOOK (2024-2029):

Hyderabad Projections:
- Price Growth: 7-9% CAGR
- Rental Growth: 5-7% CAGR
- Supply Addition: 2,00,000 units
- Infrastructure Boost: Metro Phase 2 completion

Bangalore Projections:
- Price Growth: 5-7% CAGR
- Rental Growth: 4-6% CAGR
- Supply Addition: 2,50,000 units
- Infrastructure Challenge: Traffic management

CONCLUSION:
Hyderabad offers better rental yields and affordability, making it suitable for income-focused investors. Bangalore provides better capital appreciation and established market dynamics, ideal for wealth creation. A diversified approach across both cities can optimize risk-adjusted returns.
    `,
  },
  {
    name: "LIC vs HDFC Life Insurance Comprehensive Comparison 2024.pdf",
    type: "Insurance",
    category: "insurance" as const,
    icon: Shield,
    content: `
LIC vs HDFC LIFE INSURANCE - COMPREHENSIVE COMPARISON ANALYSIS 2024

EXECUTIVE SUMMARY:
This detailed analysis compares Life Insurance Corporation of India (LIC) with HDFC Life Insurance, covering product offerings, claim settlement ratios, financial strength, and suitability for different customer segments.

LIC (LIFE INSURANCE CORPORATION OF INDIA) ANALYSIS:

Company Overview:
- Established: 1956 (68 years of operation)
- Market Share: 66.2% (individual policies), 74.6% (group policies)
- Total Premium: ₹4,12,000 crores (FY 2023-24)
- Policy Count: 29.6 crore policies in force
- Branch Network: 2,048 branches, 1,35,000+ agents
- IRDA License: Valid till perpetuity

Financial Strength:
- Total Assets: ₹41,75,000 crores
- Solvency Ratio: 1.69 (IRDA requirement: 1.50)
- Investment Portfolio: ₹38,50,000 crores
- Government Ownership: 96.5%
- Credit Rating: AAA (CRISIL, ICRA)

Claim Settlement Performance:
- Claim Settlement Ratio: 98.74% (FY 2023-24)
- Claims Settled: 10,45,000 claims
- Average Claim Processing Time: 7.2 days
- Grievance Redressal: 99.1% resolved
- Ombudsman Cases: 2,340 (lowest in industry)

Popular LIC Products:

1. LIC New Jeevan Anand:
   - Type: Endowment cum whole life
   - Premium Payment: Limited/Regular
   - Maturity Benefit: Sum Assured + Bonus
   - Death Benefit: Higher of SA or 10x annual premium
   - Tax Benefits: Section 80C, 10(10D)

2. LIC Jeevan Umang:
   - Type: Whole life plan
   - Premium Payment: Limited (15/20/25 years)
   - Survival Benefits: From 6th year onwards
   - Maturity: 100 years of age
   - Guaranteed Additions: Yes

3. LIC Tech Term:
   - Type: Pure term insurance
   - Premium: Competitive rates
   - Coverage: Up to ₹25 crores
   - Online Process: Paperless
   - Medical Tests: Minimal requirements

HDFC LIFE INSURANCE ANALYSIS:

Company Overview:
- Established: 2000 (24 years of operation)
- Market Share: 14.8% (individual policies)
- Total Premium: ₹48,500 crores (FY 2023-24)
- Policy Count: 5.2 crore policies in force
- Branch Network: 430+ branches, 2,15,000+ agents
- Promoters: HDFC Bank (47.4%), Standard Life Aberdeen (26%)

Financial Strength:
- Total Assets: ₹1,85,000 crores
- Solvency Ratio: 2.01 (well above IRDA requirement)
- Investment Portfolio: ₹1,65,000 crores
- Embedded Value: ₹32,500 crores
- Credit Rating: AAA (CRISIL, CARE)

Claim Settlement Performance:
- Claim Settlement Ratio: 98.01% (FY 2023-24)
- Claims Settled: 45,600 claims
- Average Claim Processing Time: 4.8 days
- Individual Claims Ratio: 97.8%
- Group Claims Ratio: 99.2%

Popular HDFC Life Products:

1. HDFC Life Sanchay Plus:
   - Type: Non-linked savings plan
   - Guaranteed Returns: 6.25% per annum
   - Premium Payment: Single/Limited/Regular
   - Maturity Benefit: Guaranteed
   - Liquidity: Partial withdrawal after 5 years

2. HDFC Life Click 2 Protect Plus:
   - Type: Online term insurance
   - Coverage: Up to ₹10 crores
   - Premium: Highly competitive
   - Riders: Comprehensive options
   - Claim Process: Digital-first approach

3. HDFC Life Pragati:
   - Type: ULIP (Unit Linked)
   - Fund Options: 10+ fund choices
   - Charges: Transparent structure
   - Switching: Free fund switches
   - Top-up: Flexible premium options

DETAILED COMPARISON:

Product Range:
LIC:
- Traditional Plans: Extensive range
- Term Insurance: Limited options
- ULIPs: Basic offerings
- Pension Plans: Comprehensive
- Health Plans: Limited

HDFC Life:
- Traditional Plans: Moderate range
- Term Insurance: Comprehensive options
- ULIPs: Advanced offerings
- Pension Plans: Good variety
- Health Plans: Extensive range

Premium Rates Comparison (₹1 Crore Term Cover, 30-year male, non-smoker):

LIC Tech Term:
- Annual Premium: ₹11,500
- Premium Payment: Level throughout
- Coverage Period: Up to 75 years
- Riders Available: Limited

HDFC Life Click 2 Protect Plus:
- Annual Premium: ₹9,800
- Premium Payment: Level/Increasing options
- Coverage Period: Up to 85 years
- Riders Available: Comprehensive

Technology and Digital Services:

LIC:
- Mobile App: Basic functionality
- Online Services: Limited features
- Claim Process: Largely offline
- Customer Portal: Basic interface
- Digital Adoption: Improving gradually

HDFC Life:
- Mobile App: Advanced features
- Online Services: Comprehensive
- Claim Process: Digital-first
- Customer Portal: User-friendly
- Digital Adoption: Industry leader

Customer Service Comparison:

LIC:
- Branch Network: Extensive (2,048 branches)
- Agent Network: Large (1,35,000+)
- Customer Support: Traditional approach
- Response Time: Moderate
- Grievance Resolution: Excellent track record

HDFC Life:
- Branch Network: Moderate (430+ branches)
- Agent Network: Quality-focused (2,15,000+)
- Customer Support: Multi-channel
- Response Time: Quick
- Grievance Resolution: Good performance

Investment Performance (ULIP Funds - 5 Year CAGR):

LIC:
- Equity Fund: 11.2%
- Balanced Fund: 9.8%
- Debt Fund: 7.1%
- Fund Management: Conservative approach

HDFC Life:
- Equity Fund: 13.8%
- Balanced Fund: 11.4%
- Debt Fund: 7.9%
- Fund Management: Professional expertise

TAX BENEFITS COMPARISON:

Both companies offer similar tax benefits:
- Premium Payment: Section 80C (up to ₹1.5 lakh)
- Maturity Proceeds: Section 10(10D) (tax-free)
- Death Benefit: Tax-free to nominee
- ULIP Withdrawals: Tax-free after 5 years

SUITABILITY ANALYSIS:

Choose LIC if:
- You prefer government backing
- You want traditional insurance products
- You need extensive branch network
- You prioritize claim settlement history
- You prefer conservative investment approach

Choose HDFC Life if:
- You want competitive premium rates
- You prefer digital-first experience
- You need advanced ULIP options
- You want quick claim processing
- You prefer professional fund management

PRODUCT-WISE RECOMMENDATIONS:

Term Insurance:
Winner: HDFC Life
- Lower premiums
- Better online experience
- Comprehensive rider options
- Higher coverage limits

Traditional Endowment:
Winner: LIC
- Proven track record
- Government backing
- Better bonus rates
- Extensive product range

ULIPs:
Winner: HDFC Life
- Better fund performance
- Lower charges
- More fund options
- Professional management

Pension Plans:
Winner: Tie
- Both offer comprehensive options
- LIC has government backing
- HDFC Life has better returns

FINANCIAL STRENGTH COMPARISON:

Solvency Ratio:
- LIC: 1.69 (Adequate)
- HDFC Life: 2.01 (Strong)

Assets Under Management:
- LIC: ₹41,75,000 crores (Massive scale)
- HDFC Life: ₹1,85,000 crores (Growing rapidly)

Market Position:
- LIC: Market leader (legacy advantage)
- HDFC Life: Strong challenger (innovation focus)

RISK ASSESSMENT:

LIC Risks:
- Regulatory changes affecting government companies
- Slow digital transformation
- Competition from private players
- Legacy system constraints

HDFC Life Risks:
- Market competition intensity
- Regulatory changes in insurance sector
- Economic downturn impact
- Dependence on bancassurance channel

INVESTMENT RECOMMENDATIONS:

Conservative Investors:
- Primary: LIC (70% allocation)
- Secondary: HDFC Life (30% allocation)
- Focus: Traditional plans with guaranteed returns

Moderate Investors:
- Primary: HDFC Life (60% allocation)
- Secondary: LIC (40% allocation)
- Focus: Balanced mix of traditional and ULIP

Aggressive Investors:
- Primary: HDFC Life (80% allocation)
- Secondary: LIC (20% allocation)
- Focus: ULIP and term insurance combination

CONCLUSION:
LIC remains the preferred choice for traditional, conservative investors seeking government backing and proven track record. HDFC Life is better suited for modern, tech-savvy customers wanting competitive rates and superior digital experience. A combination approach can optimize benefits from both insurers.
    `,
  },
]

export function EnhancedSampleDocuments() {
  const [loading, setLoading] = useState<string | null>(null)

  const addSampleDocument = async (doc: (typeof comprehensiveDocuments)[0]) => {
    setLoading(doc.name)
    try {
      await enhancedRAG.addDocumentChunks([
        {
          content: doc.content,
          metadata: {
            source: doc.name,
            type: doc.type,
            uploadDate: new Date().toISOString(),
            category: doc.category,
          },
          keywords: extractKeywords(doc.content, doc.category),
        },
      ])

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
      const chunks = comprehensiveDocuments.map((doc) => ({
        content: doc.content,
        metadata: {
          source: doc.name,
          type: doc.type,
          uploadDate: new Date().toISOString(),
          category: doc.category,
        },
        keywords: extractKeywords(doc.content, doc.category),
      }))

      await enhancedRAG.addDocumentChunks(chunks)
      window.dispatchEvent(new Event("documentsUpdated"))
      alert("Successfully added all comprehensive financial documents!")
    } catch (error) {
      console.error("Error adding documents:", error)
      alert("Failed to add some documents. Please try again.")
    } finally {
      setLoading(null)
    }
  }

  const extractKeywords = (content: string, category: string): string[] => {
    const commonKeywords = {
      mutual_fund: [
        "mutual fund",
        "sip",
        "nav",
        "expense ratio",
        "aum",
        "sebi",
        "ltcg",
        "stcg",
        "equity",
        "debt",
        "hybrid",
        "dividend",
        "growth",
        "direct",
        "regular",
      ],
      gold: [
        "gold",
        "silver",
        "commodity",
        "mcx",
        "sovereign gold bonds",
        "sgb",
        "etf",
        "rbi",
        "import duty",
        "gst",
        "making charges",
        "purity",
        "hallmark",
      ],
      real_estate: [
        "real estate",
        "property",
        "rera",
        "apartment",
        "villa",
        "plot",
        "rental yield",
        "capital appreciation",
        "home loan",
        "emi",
        "registration",
        "stamp duty",
      ],
      insurance: [
        "insurance",
        "lic",
        "ulip",
        "term",
        "endowment",
        "whole life",
        "premium",
        "sum assured",
        "claim settlement",
        "irda",
        "bonus",
        "maturity",
        "death benefit",
      ],
    }

    const categoryKeywords = commonKeywords[category as keyof typeof commonKeywords] || []

    // Extract additional keywords from content
    const contentKeywords =
      content
        .toLowerCase()
        .match(/\b[a-z]{4,}\b/g)
        ?.filter((word) => !["this", "that", "with", "from", "they", "have", "been", "will", "were"].includes(word))
        .slice(0, 10) || []

    return [...categoryKeywords, ...contentKeywords]
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Mutual Fund":
        return "bg-blue-100 text-blue-800"
      case "Gold Investment":
        return "bg-yellow-100 text-yellow-800"
      case "Real Estate":
        return "bg-green-100 text-green-800"
      case "Insurance":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Comprehensive Financial Documents</CardTitle>
            <CardDescription>
              Advanced financial analysis documents with detailed Indian market data and comparisons
            </CardDescription>
          </div>
          <Button onClick={addAllSamples} disabled={loading === "all"} className="bg-indigo-800 hover:bg-indigo-900">
            <Plus className="h-4 w-4 mr-2" />
            {loading === "all" ? "Adding All..." : "Add All Documents"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {comprehensiveDocuments.map((doc, index) => (
            <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
              <div className="flex items-center space-x-4">
                <doc.icon className="h-8 w-8 text-indigo-600" />
                <div>
                  <h3 className="font-medium">{doc.name}</h3>
                  <p className="text-sm text-gray-600">
                    Comprehensive {doc.type} analysis with performance data, tax implications, and investment
                    recommendations
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className={getTypeColor(doc.type)}>{doc.type}</Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addSampleDocument(doc)}
                  disabled={loading === doc.name}
                  className="min-w-[100px]"
                >
                  {loading === doc.name ? "Adding..." : "Add to KB"}
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold mb-2">What's Included:</h4>
          <ul className="text-sm space-y-1">
            <li>• HDFC Top 100 Fund: Complete performance analysis with SIP vs lumpsum comparison</li>
            <li>• Gold Investment Guide: SBI Gold ETF vs Sovereign Gold Bonds detailed comparison</li>
            <li>• Real Estate Analysis: Hyderabad vs Bangalore investment opportunities</li>
            <li>• Insurance Comparison: LIC vs HDFC Life comprehensive analysis</li>
            <li>• Tax implications, risk analysis, and investment recommendations for each category</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

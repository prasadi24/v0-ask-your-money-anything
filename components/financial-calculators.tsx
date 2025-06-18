"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calculator, TrendingUp, PiggyBank, Shield, Home } from "lucide-react"

export function FinancialCalculators() {
  const [sipData, setSipData] = useState({
    monthlyAmount: 5000,
    annualReturn: 12,
    years: 10,
  })

  const [ppfData, setPpfData] = useState({
    annualAmount: 150000,
    years: 15,
  })

  const [npsData, setNpsData] = useState({
    monthlyAmount: 3000,
    currentAge: 30,
    retirementAge: 60,
    expectedReturn: 10,
  })

  const [emiData, setEmiData] = useState({
    loanAmount: 5000000,
    interestRate: 8.5,
    tenure: 20,
  })

  // SIP Calculator
  const calculateSIP = () => {
    const monthlyRate = sipData.annualReturn / 100 / 12
    const months = sipData.years * 12
    const futureValue =
      sipData.monthlyAmount * (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate))
    const totalInvestment = sipData.monthlyAmount * months
    const returns = futureValue - totalInvestment

    return {
      futureValue: Math.round(futureValue),
      totalInvestment,
      returns: Math.round(returns),
    }
  }

  // PPF Calculator
  const calculatePPF = () => {
    const rate = 7.1 / 100 // Current PPF rate
    const years = ppfData.years
    let maturityAmount = 0

    for (let i = 1; i <= years; i++) {
      maturityAmount = (maturityAmount + ppfData.annualAmount) * (1 + rate)
    }

    const totalInvestment = ppfData.annualAmount * years
    const returns = maturityAmount - totalInvestment

    return {
      maturityAmount: Math.round(maturityAmount),
      totalInvestment,
      returns: Math.round(returns),
    }
  }

  // NPS Calculator
  const calculateNPS = () => {
    const monthlyRate = npsData.expectedReturn / 100 / 12
    const months = (npsData.retirementAge - npsData.currentAge) * 12
    const corpusAtRetirement =
      npsData.monthlyAmount * (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate))

    // 40% mandatory annuity, 60% lump sum
    const lumpSum = corpusAtRetirement * 0.6
    const annuityAmount = corpusAtRetirement * 0.4
    const monthlyPension = (annuityAmount * 0.06) / 12 // Assuming 6% annuity rate

    const totalInvestment = npsData.monthlyAmount * months

    return {
      totalCorpus: Math.round(corpusAtRetirement),
      lumpSum: Math.round(lumpSum),
      monthlyPension: Math.round(monthlyPension),
      totalInvestment,
    }
  }

  // EMI Calculator
  const calculateEMI = () => {
    const monthlyRate = emiData.interestRate / 100 / 12
    const months = emiData.tenure * 12
    const emi =
      (emiData.loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1)
    const totalAmount = emi * months
    const totalInterest = totalAmount - emiData.loanAmount

    return {
      emi: Math.round(emi),
      totalAmount: Math.round(totalAmount),
      totalInterest: Math.round(totalInterest),
    }
  }

  const sipResults = calculateSIP()
  const ppfResults = calculatePPF()
  const npsResults = calculateNPS()
  const emiResults = calculateEMI()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calculator className="h-5 w-5" />
          <span>Indian Financial Calculators</span>
        </CardTitle>
        <CardDescription>
          Calculate SIP returns, PPF maturity, NPS corpus, and home loan EMIs with Indian tax implications
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="sip" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="sip">SIP Calculator</TabsTrigger>
            <TabsTrigger value="ppf">PPF Calculator</TabsTrigger>
            <TabsTrigger value="nps">NPS Calculator</TabsTrigger>
            <TabsTrigger value="emi">EMI Calculator</TabsTrigger>
          </TabsList>

          {/* SIP Calculator */}
          <TabsContent value="sip" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-4">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold">SIP Investment Calculator</h3>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sip-amount">Monthly SIP Amount (₹)</Label>
                  <Input
                    id="sip-amount"
                    type="number"
                    value={sipData.monthlyAmount}
                    onChange={(e) => setSipData({ ...sipData, monthlyAmount: Number(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sip-return">Expected Annual Return (%)</Label>
                  <Input
                    id="sip-return"
                    type="number"
                    step="0.1"
                    value={sipData.annualReturn}
                    onChange={(e) => setSipData({ ...sipData, annualReturn: Number(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sip-years">Investment Period (Years)</Label>
                  <Input
                    id="sip-years"
                    type="number"
                    value={sipData.years}
                    onChange={(e) => setSipData({ ...sipData, years: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="bg-blue-50 p-6 rounded-lg">
                <h4 className="font-semibold mb-4">SIP Results</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Total Investment:</span>
                    <span className="font-semibold">₹{sipResults.totalInvestment.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Expected Returns:</span>
                    <span className="font-semibold text-green-600">₹{sipResults.returns.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span>Maturity Value:</span>
                    <span className="font-bold text-lg">₹{sipResults.futureValue.toLocaleString()}</span>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-yellow-50 rounded text-sm">
                  <strong>Tax Implications:</strong>
                  <ul className="mt-1 space-y-1">
                    <li>• LTCG Tax: 10% on gains above ₹1 lakh (if equity funds)</li>
                    <li>• STCG Tax: 15% (if redeemed within 1 year)</li>
                    <li>• Debt funds: As per income tax slab</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* PPF Calculator */}
          <TabsContent value="ppf" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-4">
                  <PiggyBank className="h-5 w-5 text-green-600" />
                  <h3 className="text-lg font-semibold">PPF Calculator</h3>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ppf-amount">Annual PPF Investment (₹)</Label>
                  <Input
                    id="ppf-amount"
                    type="number"
                    value={ppfData.annualAmount}
                    onChange={(e) => setPpfData({ ...ppfData, annualAmount: Number(e.target.value) })}
                  />
                  <p className="text-xs text-gray-600">Maximum: ₹1,50,000 per year</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ppf-years">Investment Period (Years)</Label>
                  <Input
                    id="ppf-years"
                    type="number"
                    value={ppfData.years}
                    onChange={(e) => setPpfData({ ...ppfData, years: Number(e.target.value) })}
                  />
                  <p className="text-xs text-gray-600">Minimum: 15 years (lock-in period)</p>
                </div>
              </div>

              <div className="bg-green-50 p-6 rounded-lg">
                <h4 className="font-semibold mb-4">PPF Results (Current Rate: 7.1%)</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Total Investment:</span>
                    <span className="font-semibold">₹{ppfResults.totalInvestment.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Interest Earned:</span>
                    <span className="font-semibold text-green-600">₹{ppfResults.returns.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span>Maturity Amount:</span>
                    <span className="font-bold text-lg">₹{ppfResults.maturityAmount.toLocaleString()}</span>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-blue-50 rounded text-sm">
                  <strong>Tax Benefits:</strong>
                  <ul className="mt-1 space-y-1">
                    <li>• Investment: Deduction under Section 80C</li>
                    <li>• Interest: Tax-free</li>
                    <li>• Maturity: Completely tax-free</li>
                    <li>• EEE (Exempt-Exempt-Exempt) status</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* NPS Calculator */}
          <TabsContent value="nps" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-4">
                  <Shield className="h-5 w-5 text-purple-600" />
                  <h3 className="text-lg font-semibold">NPS Calculator</h3>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nps-amount">Monthly NPS Contribution (₹)</Label>
                  <Input
                    id="nps-amount"
                    type="number"
                    value={npsData.monthlyAmount}
                    onChange={(e) => setNpsData({ ...npsData, monthlyAmount: Number(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nps-current-age">Current Age</Label>
                  <Input
                    id="nps-current-age"
                    type="number"
                    value={npsData.currentAge}
                    onChange={(e) => setNpsData({ ...npsData, currentAge: Number(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nps-retirement-age">Retirement Age</Label>
                  <Input
                    id="nps-retirement-age"
                    type="number"
                    value={npsData.retirementAge}
                    onChange={(e) => setNpsData({ ...npsData, retirementAge: Number(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nps-return">Expected Annual Return (%)</Label>
                  <Input
                    id="nps-return"
                    type="number"
                    step="0.1"
                    value={npsData.expectedReturn}
                    onChange={(e) => setNpsData({ ...npsData, expectedReturn: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="bg-purple-50 p-6 rounded-lg">
                <h4 className="font-semibold mb-4">NPS Results</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Total Investment:</span>
                    <span className="font-semibold">₹{npsResults.totalInvestment.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Corpus at Retirement:</span>
                    <span className="font-semibold">₹{npsResults.totalCorpus.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Lump Sum (60%):</span>
                    <span className="font-semibold text-green-600">₹{npsResults.lumpSum.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span>Monthly Pension:</span>
                    <span className="font-bold text-lg">₹{npsResults.monthlyPension.toLocaleString()}</span>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-yellow-50 rounded text-sm">
                  <strong>Tax Benefits:</strong>
                  <ul className="mt-1 space-y-1">
                    <li>• Section 80C: Up to ₹1.5 lakh</li>
                    <li>• Section 80CCD(1B): Additional ₹50,000</li>
                    <li>• Lump sum: Tax-free up to 60%</li>
                    <li>• Pension: Taxable as per slab</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* EMI Calculator */}
          <TabsContent value="emi" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-4">
                  <Home className="h-5 w-5 text-orange-600" />
                  <h3 className="text-lg font-semibold">Home Loan EMI Calculator</h3>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emi-amount">Loan Amount (₹)</Label>
                  <Input
                    id="emi-amount"
                    type="number"
                    value={emiData.loanAmount}
                    onChange={(e) => setEmiData({ ...emiData, loanAmount: Number(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emi-rate">Interest Rate (% per annum)</Label>
                  <Input
                    id="emi-rate"
                    type="number"
                    step="0.1"
                    value={emiData.interestRate}
                    onChange={(e) => setEmiData({ ...emiData, interestRate: Number(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emi-tenure">Loan Tenure (Years)</Label>
                  <Input
                    id="emi-tenure"
                    type="number"
                    value={emiData.tenure}
                    onChange={(e) => setEmiData({ ...emiData, tenure: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="bg-orange-50 p-6 rounded-lg">
                <h4 className="font-semibold mb-4">EMI Results</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Principal Amount:</span>
                    <span className="font-semibold">₹{emiData.loanAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Interest:</span>
                    <span className="font-semibold text-red-600">₹{emiResults.totalInterest.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Amount:</span>
                    <span className="font-semibold">₹{emiResults.totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span>Monthly EMI:</span>
                    <span className="font-bold text-lg">₹{emiResults.emi.toLocaleString()}</span>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-blue-50 rounded text-sm">
                  <strong>Tax Benefits:</strong>
                  <ul className="mt-1 space-y-1">
                    <li>• Principal: Section 80C (up to ₹1.5 lakh)</li>
                    <li>• Interest: Section 24(b) (up to ₹2 lakh)</li>
                    <li>• First-time buyer: Additional ₹50,000</li>
                    <li>• Stamp duty: Section 80C eligible</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

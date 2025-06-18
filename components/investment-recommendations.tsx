"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Target, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react"

interface UserProfile {
  age: number
  monthlyIncome: number
  monthlyExpenses: number
  riskTolerance: "conservative" | "moderate" | "aggressive"
  investmentHorizon: "short" | "medium" | "long"
  goals: string[]
  currentInvestments: number
  dependents: number
  hasEmergencyFund: boolean
  hasHealthInsurance: boolean
  hasTermInsurance: boolean
}

interface Recommendation {
  id: string
  name: string
  type: "equity" | "debt" | "gold" | "real_estate" | "insurance" | "emergency"
  allocation: number
  expectedReturn: string
  riskLevel: "low" | "medium" | "high"
  description: string
  products: string[]
  taxBenefits?: string
  liquidity: "high" | "medium" | "low"
  minInvestment: number
}

interface GoalPlan {
  goal: string
  targetAmount: number
  timeHorizon: number
  monthlyInvestment: number
  recommendedProducts: string[]
  strategy: string
}

const investmentGoals = [
  "Retirement Planning",
  "Child Education",
  "House Purchase",
  "Emergency Fund",
  "Wealth Creation",
  "Tax Saving",
  "Marriage/Wedding",
  "Travel Fund",
  "Business Investment",
  "Healthcare Fund",
]

export function InvestmentRecommendations() {
  const [step, setStep] = useState(1)
  const [userProfile, setUserProfile] = useState<UserProfile>({
    age: 30,
    monthlyIncome: 75000,
    monthlyExpenses: 45000,
    riskTolerance: "moderate",
    investmentHorizon: "long",
    goals: [],
    currentInvestments: 0,
    dependents: 0,
    hasEmergencyFund: false,
    hasHealthInsurance: false,
    hasTermInsurance: false,
  })
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [goalPlans, setGoalPlans] = useState<GoalPlan[]>([])

  // Generate recommendations based on user profile
  const generateRecommendations = (): Recommendation[] => {
    const { age, monthlyIncome, monthlyExpenses, riskTolerance, investmentHorizon, hasEmergencyFund } = userProfile
    const monthlySurplus = monthlyIncome - monthlyExpenses
    const recommendations: Recommendation[] = []

    // Emergency Fund (Priority 1)
    if (!hasEmergencyFund) {
      recommendations.push({
        id: "emergency",
        name: "Emergency Fund",
        type: "emergency",
        allocation: 100,
        expectedReturn: "4-6%",
        riskLevel: "low",
        description: "6-12 months of expenses in liquid instruments",
        products: ["Liquid Mutual Funds", "High-yield Savings Account", "Short-term FDs"],
        liquidity: "high",
        minInvestment: monthlyExpenses * 6,
      })
      return recommendations
    }

    // Risk-based allocation
    let equityAllocation = 0
    let debtAllocation = 0
    const goldAllocation = 5

    if (riskTolerance === "conservative") {
      equityAllocation = Math.max(20, 100 - age) // Conservative: 100-age rule with minimum 20%
      debtAllocation = 100 - equityAllocation - goldAllocation
    } else if (riskTolerance === "moderate") {
      equityAllocation = Math.max(30, 120 - age) // Moderate: 120-age rule with minimum 30%
      debtAllocation = 100 - equityAllocation - goldAllocation
    } else {
      equityAllocation = Math.max(40, 140 - age) // Aggressive: 140-age rule with minimum 40%
      debtAllocation = 100 - equityAllocation - goldAllocation
    }

    // Equity Recommendations
    if (equityAllocation > 0) {
      recommendations.push({
        id: "equity",
        name: "Equity Investments",
        type: "equity",
        allocation: equityAllocation,
        expectedReturn: "12-15%",
        riskLevel: riskTolerance === "conservative" ? "medium" : "high",
        description: "Large-cap and diversified equity mutual funds for long-term wealth creation",
        products: [
          "HDFC Top 100 Fund",
          "Axis Bluechip Fund",
          "SBI Large Cap Fund",
          "Mirae Asset Large Cap Fund",
          "ICICI Pru Bluechip Fund",
        ],
        taxBenefits: "LTCG tax: 10% above ₹1 lakh",
        liquidity: "high",
        minInvestment: 500,
      })
    }

    // Debt Recommendations
    if (debtAllocation > 0) {
      recommendations.push({
        id: "debt",
        name: "Debt Investments",
        type: "debt",
        allocation: debtAllocation,
        expectedReturn: "6-8%",
        riskLevel: "low",
        description: "Stable income and capital preservation through debt instruments",
        products: ["PPF", "HDFC Corporate Bond Fund", "SBI Banking & PSU Fund", "NSC", "Tax-free Bonds"],
        taxBenefits: "PPF: Section 80C + tax-free maturity",
        liquidity: "medium",
        minInvestment: 500,
      })
    }

    // Gold Recommendations
    recommendations.push({
      id: "gold",
      name: "Gold Investment",
      type: "gold",
      allocation: goldAllocation,
      expectedReturn: "8-10%",
      riskLevel: "medium",
      description: "Hedge against inflation and portfolio diversification",
      products: ["Sovereign Gold Bonds", "SBI Gold ETF", "HDFC Gold Fund", "Digital Gold"],
      taxBenefits: "SGB: Tax-free if held till maturity",
      liquidity: "medium",
      minInvestment: 1000,
    })

    // Insurance Recommendations
    if (!userProfile.hasTermInsurance) {
      const coverageNeeded = monthlyIncome * 12 * 10 // 10x annual income
      recommendations.push({
        id: "term_insurance",
        name: "Term Life Insurance",
        type: "insurance",
        allocation: 0,
        expectedReturn: "Protection",
        riskLevel: "low",
        description: `₹${(coverageNeeded / 10000000).toFixed(1)} crore term coverage for family protection`,
        products: ["HDFC Click 2 Protect Plus", "LIC Tech Term", "SBI eShield", "Max Life Smart Term"],
        taxBenefits: "Section 80C: Premium deduction",
        liquidity: "low",
        minInvestment: coverageNeeded * 0.001, // Approximate annual premium
      })
    }

    if (!userProfile.hasHealthInsurance) {
      recommendations.push({
        id: "health_insurance",
        name: "Health Insurance",
        type: "insurance",
        allocation: 0,
        expectedReturn: "Protection",
        riskLevel: "low",
        description: "₹10-20 lakh family health coverage",
        products: ["Star Health", "HDFC ERGO", "ICICI Lombard", "Care Health"],
        taxBenefits: "Section 80D: Premium deduction",
        liquidity: "low",
        minInvestment: 15000,
      })
    }

    return recommendations
  }

  // Generate goal-based plans
  const generateGoalPlans = (): GoalPlan[] => {
    const plans: GoalPlan[] = []

    userProfile.goals.forEach((goal) => {
      let targetAmount = 0
      let timeHorizon = 0
      let strategy = ""
      let recommendedProducts: string[] = []

      switch (goal) {
        case "Retirement Planning":
          targetAmount = userProfile.monthlyExpenses * 12 * 25 // 25x annual expenses
          timeHorizon = 60 - userProfile.age
          strategy = "Equity-heavy portfolio with systematic investment"
          recommendedProducts = ["Equity Mutual Funds", "PPF", "NPS", "ELSS"]
          break

        case "Child Education":
          targetAmount = 5000000 // ₹50 lakh for higher education
          timeHorizon = 18
          strategy = "Balanced approach with increasing debt allocation near goal"
          recommendedProducts = ["Child Education Plans", "Sukanya Samriddhi", "Balanced Funds"]
          break

        case "House Purchase":
          targetAmount = 2000000 // ₹20 lakh down payment
          timeHorizon = 5
          strategy = "Conservative approach with capital protection"
          recommendedProducts = ["Debt Funds", "FDs", "Liquid Funds"]
          break

        case "Emergency Fund":
          targetAmount = userProfile.monthlyExpenses * 6
          timeHorizon = 1
          strategy = "High liquidity with capital safety"
          recommendedProducts = ["Liquid Funds", "Savings Account", "Ultra Short-term Funds"]
          break

        default:
          targetAmount = 1000000
          timeHorizon = 10
          strategy = "Balanced investment approach"
          recommendedProducts = ["Diversified Equity Funds", "Hybrid Funds"]
      }

      // Calculate required monthly investment
      const annualReturn = 0.12 // Assuming 12% return
      const monthlyReturn = annualReturn / 12
      const months = timeHorizon * 12
      const monthlyInvestment =
        (targetAmount * monthlyReturn) / (Math.pow(1 + monthlyReturn, months) - 1) || targetAmount / months

      plans.push({
        goal,
        targetAmount,
        timeHorizon,
        monthlyInvestment: Math.round(monthlyInvestment),
        recommendedProducts,
        strategy,
      })
    })

    return plans
  }

  // Calculate risk score
  const calculateRiskScore = (): number => {
    let score = 0

    // Age factor (younger = higher risk capacity)
    if (userProfile.age < 30) score += 30
    else if (userProfile.age < 40) score += 25
    else if (userProfile.age < 50) score += 20
    else score += 10

    // Income factor
    if (userProfile.monthlyIncome > 100000) score += 25
    else if (userProfile.monthlyIncome > 50000) score += 20
    else score += 15

    // Surplus factor
    const surplus = userProfile.monthlyIncome - userProfile.monthlyExpenses
    const surplusRatio = surplus / userProfile.monthlyIncome
    if (surplusRatio > 0.4) score += 25
    else if (surplusRatio > 0.2) score += 20
    else score += 10

    // Risk tolerance
    if (userProfile.riskTolerance === "aggressive") score += 20
    else if (userProfile.riskTolerance === "moderate") score += 15
    else score += 10

    return Math.min(score, 100)
  }

  const handleGenerateRecommendations = () => {
    const recs = generateRecommendations()
    const plans = generateGoalPlans()
    setRecommendations(recs)
    setGoalPlans(plans)
    setStep(3)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const riskScore = calculateRiskScore()
  const monthlySurplus = userProfile.monthlyIncome - userProfile.monthlyExpenses

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Target className="h-5 w-5 text-indigo-600" />
          <span>AI Investment Recommendations</span>
        </CardTitle>
        <CardDescription>Get personalized investment advice based on your financial profile and goals</CardDescription>
      </CardHeader>

      <CardContent>
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold mb-2">Let's understand your financial profile</h3>
              <p className="text-gray-600">This information helps us create personalized recommendations</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={userProfile.age}
                    onChange={(e) => setUserProfile({ ...userProfile, age: Number(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="income">Monthly Income (₹)</Label>
                  <Input
                    id="income"
                    type="number"
                    value={userProfile.monthlyIncome}
                    onChange={(e) => setUserProfile({ ...userProfile, monthlyIncome: Number(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expenses">Monthly Expenses (₹)</Label>
                  <Input
                    id="expenses"
                    type="number"
                    value={userProfile.monthlyExpenses}
                    onChange={(e) => setUserProfile({ ...userProfile, monthlyExpenses: Number(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dependents">Number of Dependents</Label>
                  <Input
                    id="dependents"
                    type="number"
                    value={userProfile.dependents}
                    onChange={(e) => setUserProfile({ ...userProfile, dependents: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="risk">Risk Tolerance</Label>
                  <select
                    id="risk"
                    value={userProfile.riskTolerance}
                    onChange={(e) =>
                      setUserProfile({
                        ...userProfile,
                        riskTolerance: e.target.value as UserProfile["riskTolerance"],
                      })
                    }
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="conservative">Conservative (Safety first)</option>
                    <option value="moderate">Moderate (Balanced approach)</option>
                    <option value="aggressive">Aggressive (High growth potential)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="horizon">Investment Horizon</Label>
                  <select
                    id="horizon"
                    value={userProfile.investmentHorizon}
                    onChange={(e) =>
                      setUserProfile({
                        ...userProfile,
                        investmentHorizon: e.target.value as UserProfile["investmentHorizon"],
                      })
                    }
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="short">Short-term (1-3 years)</option>
                    <option value="medium">Medium-term (3-7 years)</option>
                    <option value="long">Long-term (7+ years)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="current">Current Investments (₹)</Label>
                  <Input
                    id="current"
                    type="number"
                    value={userProfile.currentInvestments}
                    onChange={(e) => setUserProfile({ ...userProfile, currentInvestments: Number(e.target.value) })}
                  />
                </div>

                <div className="space-y-3">
                  <Label>Current Financial Protection</Label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={userProfile.hasEmergencyFund}
                        onChange={(e) => setUserProfile({ ...userProfile, hasEmergencyFund: e.target.checked })}
                      />
                      <span className="text-sm">Emergency Fund (6+ months expenses)</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={userProfile.hasHealthInsurance}
                        onChange={(e) => setUserProfile({ ...userProfile, hasHealthInsurance: e.target.checked })}
                      />
                      <span className="text-sm">Health Insurance</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={userProfile.hasTermInsurance}
                        onChange={(e) => setUserProfile({ ...userProfile, hasTermInsurance: e.target.checked })}
                      />
                      <span className="text-sm">Term Life Insurance</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t">
              <div className="text-sm text-gray-600">
                Monthly Surplus: <span className="font-semibold">{formatCurrency(monthlySurplus)}</span>
              </div>
              <Button onClick={() => setStep(2)} className="bg-indigo-800 hover:bg-indigo-900">
                Next: Select Goals
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold mb-2">What are your financial goals?</h3>
              <p className="text-gray-600">Select all goals that apply to you</p>
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              {investmentGoals.map((goal) => (
                <label
                  key={goal}
                  className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    checked={userProfile.goals.includes(goal)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setUserProfile({ ...userProfile, goals: [...userProfile.goals, goal] })
                      } else {
                        setUserProfile({ ...userProfile, goals: userProfile.goals.filter((g) => g !== goal) })
                      }
                    }}
                  />
                  <span className="font-medium">{goal}</span>
                </label>
              ))}
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Your Risk Profile</h4>
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <Progress value={riskScore} className="h-2" />
                </div>
                <span className="font-semibold">{riskScore}/100</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {riskScore >= 80
                  ? "High risk capacity - Suitable for aggressive investments"
                  : riskScore >= 60
                    ? "Moderate risk capacity - Balanced investment approach"
                    : "Conservative risk capacity - Focus on capital preservation"}
              </p>
            </div>

            <div className="flex justify-between pt-4 border-t">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button
                onClick={handleGenerateRecommendations}
                disabled={userProfile.goals.length === 0}
                className="bg-indigo-800 hover:bg-indigo-900"
              >
                Generate Recommendations
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <Tabs defaultValue="recommendations" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="recommendations">Asset Allocation</TabsTrigger>
              <TabsTrigger value="goals">Goal Planning</TabsTrigger>
              <TabsTrigger value="action">Action Plan</TabsTrigger>
            </TabsList>

            <TabsContent value="recommendations" className="space-y-4">
              <div className="grid gap-4">
                {recommendations.map((rec) => (
                  <Card key={rec.id} className="border-l-4 border-l-indigo-500">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{rec.name}</CardTitle>
                        <div className="flex items-center space-x-2">
                          {rec.allocation > 0 && (
                            <Badge variant="outline" className="bg-indigo-50">
                              {rec.allocation}%
                            </Badge>
                          )}
                          <Badge
                            className={
                              rec.riskLevel === "high"
                                ? "bg-red-100 text-red-800"
                                : rec.riskLevel === "medium"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-green-100 text-green-800"
                            }
                          >
                            {rec.riskLevel} risk
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-gray-700">{rec.description}</p>

                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Expected Return:</span> {rec.expectedReturn}
                        </div>
                        <div>
                          <span className="font-medium">Liquidity:</span> {rec.liquidity}
                        </div>
                        <div>
                          <span className="font-medium">Min Investment:</span> {formatCurrency(rec.minInvestment)}
                        </div>
                        {rec.taxBenefits && (
                          <div>
                            <span className="font-medium">Tax Benefits:</span> {rec.taxBenefits}
                          </div>
                        )}
                      </div>

                      <div>
                        <span className="font-medium text-sm">Recommended Products:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {rec.products.map((product, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {product}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="goals" className="space-y-4">
              {goalPlans.length === 0 ? (
                <div className="text-center py-8">
                  <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No goals selected</h3>
                  <p className="text-gray-600">Go back and select your financial goals to see detailed plans.</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {goalPlans.map((plan, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Target className="h-5 w-5 text-indigo-600" />
                          <span>{plan.goal}</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid md:grid-cols-3 gap-4">
                          <div className="text-center p-3 bg-blue-50 rounded-lg">
                            <div className="text-sm text-gray-600">Target Amount</div>
                            <div className="text-lg font-bold">{formatCurrency(plan.targetAmount)}</div>
                          </div>
                          <div className="text-center p-3 bg-green-50 rounded-lg">
                            <div className="text-sm text-gray-600">Time Horizon</div>
                            <div className="text-lg font-bold">{plan.timeHorizon} years</div>
                          </div>
                          <div className="text-center p-3 bg-yellow-50 rounded-lg">
                            <div className="text-sm text-gray-600">Monthly Investment</div>
                            <div className="text-lg font-bold">{formatCurrency(plan.monthlyInvestment)}</div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">Strategy</h4>
                          <p className="text-gray-700">{plan.strategy}</p>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">Recommended Products</h4>
                          <div className="flex flex-wrap gap-1">
                            {plan.recommendedProducts.map((product, idx) => (
                              <Badge key={idx} variant="outline">
                                {product}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="action" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Your Action Plan</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <h4 className="font-semibold">Immediate Actions (This Month)</h4>
                    <ul className="space-y-2">
                      {!userProfile.hasEmergencyFund && (
                        <li className="flex items-center space-x-2">
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                          <span>Build emergency fund: {formatCurrency(userProfile.monthlyExpenses * 6)}</span>
                        </li>
                      )}
                      {!userProfile.hasTermInsurance && (
                        <li className="flex items-center space-x-2">
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                          <span>
                            Get term life insurance: ₹{(userProfile.monthlyIncome * 120).toLocaleString()} coverage
                          </span>
                        </li>
                      )}
                      {!userProfile.hasHealthInsurance && (
                        <li className="flex items-center space-x-2">
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                          <span>Get health insurance: ₹10-20 lakh family coverage</span>
                        </li>
                      )}
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold">Investment Actions (Next 3 Months)</h4>
                    <ul className="space-y-2">
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Start SIP in recommended mutual funds</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Open PPF account for tax savings</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Invest in Sovereign Gold Bonds</span>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold">Long-term Actions (6+ Months)</h4>
                    <ul className="space-y-2">
                      <li className="flex items-center space-x-2">
                        <TrendingUp className="h-4 w-4 text-blue-600" />
                        <span>Review and rebalance portfolio quarterly</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <TrendingUp className="h-4 w-4 text-blue-600" />
                        <span>Increase SIP amount with salary increments</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <TrendingUp className="h-4 w-4 text-blue-600" />
                        <span>Consider real estate investment after 5 years</span>
                      </li>
                    </ul>
                  </div>

                  <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center">
                      <AlertTriangle className="h-4 w-4 text-yellow-600 mr-2" />
                      Important Disclaimers
                    </h4>
                    <ul className="text-sm space-y-1">
                      <li>
                        • These recommendations are based on the information provided and general market assumptions
                      </li>
                      <li>• Past performance does not guarantee future returns</li>
                      <li>
                        • Please consult with a SEBI-registered financial advisor before making investment decisions
                      </li>
                      <li>• Review and adjust your portfolio based on changing life circumstances</li>
                      <li>• Consider tax implications and your overall financial situation</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <div className="flex justify-between pt-4 border-t">
              <Button variant="outline" onClick={() => setStep(1)}>
                Start Over
              </Button>
              <Button className="bg-indigo-800 hover:bg-indigo-900">Save Recommendations</Button>
            </div>
          </Tabs>
        )}
      </CardContent>
    </Card>
  )
}

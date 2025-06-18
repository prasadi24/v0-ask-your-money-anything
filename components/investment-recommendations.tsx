"use client"

interface UserProfile {
  age: number
  monthlyIncome: number
  monthlyExpenses: number
  riskTolerance: "conservative" | "moderate" | "aggressive"
  investmentHorizon: "short" | "medium" | "long"
  goals: string[]
  currentInvestments: number
}

interface Recommendation {
  id: string
  name: string
  type: string
  allocation: number
  expectedReturn: string
  riskLevel: string
}

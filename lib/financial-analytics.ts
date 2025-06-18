export class FinancialAnalytics {
  // Calculate portfolio metrics
  static calculateSharpeRatio(returns: number[], riskFreeRate: number): number {
    const avgReturn = returns.reduce((a, b) => a + b) / returns.length
    const variance = returns.reduce((acc, ret) => acc + Math.pow(ret - avgReturn, 2), 0) / returns.length
    const stdDev = Math.sqrt(variance)

    return (avgReturn - riskFreeRate) / stdDev
  }

  // Portfolio diversification analysis
  static analyzeDiversification(holdings: Array<{ symbol: string; weight: number; sector: string }>) {
    const sectorWeights = holdings.reduce(
      (acc, holding) => {
        acc[holding.sector] = (acc[holding.sector] || 0) + holding.weight
        return acc
      },
      {} as Record<string, number>,
    )

    const diversificationScore = Object.values(sectorWeights).reduce((acc, weight) => {
      return acc - weight * Math.log(weight)
    }, 0)

    return {
      sectorWeights,
      diversificationScore,
      recommendation: diversificationScore > 2 ? "Well diversified" : "Consider diversification",
    }
  }

  // SIP calculator
  static calculateSIP(monthlyAmount: number, annualRate: number, years: number) {
    const monthlyRate = annualRate / 12 / 100
    const months = years * 12

    const futureValue = monthlyAmount * (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate))
    const totalInvested = monthlyAmount * months
    const totalReturns = futureValue - totalInvested

    return {
      futureValue: Math.round(futureValue),
      totalInvested,
      totalReturns: Math.round(totalReturns),
      annualizedReturn: ((futureValue / totalInvested) ** (1 / years) - 1) * 100,
    }
  }
}

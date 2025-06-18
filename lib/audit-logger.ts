// Audit logging system for compliance and security
interface AuditLog {
  id: string
  userId?: string
  sessionId: string
  action: string
  resource: string
  details: Record<string, any>
  ipAddress?: string
  userAgent?: string
  timestamp: string
  severity: "low" | "medium" | "high"
}

interface SecurityEvent {
  type: "login_attempt" | "failed_login" | "data_access" | "query_submitted" | "recommendation_generated"
  userId?: string
  details: Record<string, any>
  riskLevel: "low" | "medium" | "high"
}

export class AuditLogger {
  private logs: AuditLog[] = []
  private maxLogs = 10000 // Keep last 10k logs in memory

  // Log user actions for compliance
  async logAction(
    action: string,
    resource: string,
    details: Record<string, any> = {},
    userId?: string,
    severity: AuditLog["severity"] = "low",
  ): Promise<void> {
    const log: AuditLog = {
      id: this.generateId(),
      userId,
      sessionId: this.getSessionId(),
      action,
      resource,
      details,
      ipAddress: this.getClientIP(),
      userAgent: this.getUserAgent(),
      timestamp: new Date().toISOString(),
      severity,
    }

    this.logs.push(log)

    // Keep only recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs)
    }

    // Store in localStorage for persistence
    this.persistLogs()

    // In production, send to secure logging service
    if (severity === "high") {
      await this.sendToSecureLogging(log)
    }
  }

  // Log security events
  async logSecurityEvent(event: SecurityEvent): Promise<void> {
    await this.logAction(
      `security_${event.type}`,
      "security",
      {
        eventType: event.type,
        riskLevel: event.riskLevel,
        ...event.details,
      },
      event.userId,
      event.riskLevel === "high" ? "high" : "medium",
    )
  }

  // Log financial queries for compliance
  async logFinancialQuery(
    query: string,
    response: string,
    sources: string[],
    userId?: string,
    confidence?: number,
  ): Promise<void> {
    await this.logAction(
      "financial_query",
      "ai_assistant",
      {
        query: this.sanitizeQuery(query),
        responseLength: response.length,
        sourcesCount: sources.length,
        sources,
        confidence,
        queryCategory: this.categorizeQuery(query),
      },
      userId,
      "medium",
    )
  }

  // Log investment recommendations
  async logRecommendation(userProfile: any, recommendations: any[], userId?: string): Promise<void> {
    await this.logAction(
      "investment_recommendation",
      "recommendation_engine",
      {
        userAge: userProfile.age,
        riskTolerance: userProfile.riskTolerance,
        investmentHorizon: userProfile.investmentHorizon,
        recommendationCount: recommendations.length,
        recommendationTypes: recommendations.map((r) => r.type),
        totalAllocation: recommendations.reduce((sum, r) => sum + (r.allocation || 0), 0),
      },
      userId,
      "high",
    )
  }

  // Get audit logs for compliance reporting
  getAuditLogs(
    filters: {
      userId?: string
      action?: string
      severity?: AuditLog["severity"]
      startDate?: string
      endDate?: string
    } = {},
  ): AuditLog[] {
    let filteredLogs = [...this.logs]

    if (filters.userId) {
      filteredLogs = filteredLogs.filter((log) => log.userId === filters.userId)
    }

    if (filters.action) {
      filteredLogs = filteredLogs.filter((log) => log.action.includes(filters.action))
    }

    if (filters.severity) {
      filteredLogs = filteredLogs.filter((log) => log.severity === filters.severity)
    }

    if (filters.startDate) {
      filteredLogs = filteredLogs.filter((log) => log.timestamp >= filters.startDate!)
    }

    if (filters.endDate) {
      filteredLogs = filteredLogs.filter((log) => log.timestamp <= filters.endDate!)
    }

    return filteredLogs.sort((a, b) => b.timestamp.localeCompare(a.timestamp))
  }

  // Generate compliance report
  generateComplianceReport(
    startDate: string,
    endDate: string,
  ): {
    summary: Record<string, number>
    highRiskEvents: AuditLog[]
    userActivity: Record<string, number>
    recommendations: {
      total: number
      byRiskTolerance: Record<string, number>
      byAge: Record<string, number>
    }
  } {
    const logs = this.getAuditLogs({ startDate, endDate })

    const summary = logs.reduce(
      (acc, log) => {
        acc[log.action] = (acc[log.action] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const highRiskEvents = logs.filter((log) => log.severity === "high")

    const userActivity = logs.reduce(
      (acc, log) => {
        if (log.userId) {
          acc[log.userId] = (acc[log.userId] || 0) + 1
        }
        return acc
      },
      {} as Record<string, number>,
    )

    const recommendationLogs = logs.filter((log) => log.action === "investment_recommendation")
    const recommendations = {
      total: recommendationLogs.length,
      byRiskTolerance: recommendationLogs.reduce(
        (acc, log) => {
          const risk = log.details.riskTolerance || "unknown"
          acc[risk] = (acc[risk] || 0) + 1
          return acc
        },
        {} as Record<string, number>,
      ),
      byAge: recommendationLogs.reduce(
        (acc, log) => {
          const ageGroup = this.getAgeGroup(log.details.userAge)
          acc[ageGroup] = (acc[ageGroup] || 0) + 1
          return acc
        },
        {} as Record<string, number>,
      ),
    }

    return {
      summary,
      highRiskEvents,
      userActivity,
      recommendations,
    }
  }

  // Export logs for compliance
  exportLogs(format: "json" | "csv" = "json"): string {
    if (format === "csv") {
      const headers = ["Timestamp", "User ID", "Action", "Resource", "Severity", "IP Address"]
      const rows = this.logs.map((log) => [
        log.timestamp,
        log.userId || "anonymous",
        log.action,
        log.resource,
        log.severity,
        log.ipAddress || "unknown",
      ])

      return [headers, ...rows].map((row) => row.join(",")).join("\n")
    }

    return JSON.stringify(this.logs, null, 2)
  }

  private generateId(): string {
    return `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private getSessionId(): string {
    if (typeof window !== "undefined") {
      let sessionId = sessionStorage.getItem("arthagpt_session_id")
      if (!sessionId) {
        sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        sessionStorage.setItem("arthagpt_session_id", sessionId)
      }
      return sessionId
    }
    return "server_session"
  }

  private getClientIP(): string | undefined {
    // In production, this would be extracted from request headers
    return "client_ip_masked"
  }

  private getUserAgent(): string | undefined {
    if (typeof window !== "undefined") {
      return window.navigator.userAgent
    }
    return undefined
  }

  private sanitizeQuery(query: string): string {
    // Remove potential PII from queries
    return query
      .replace(/\b\d{4}\s?\d{4}\s?\d{4}\s?\d{4}\b/g, "[CARD_NUMBER]") // Credit card numbers
      .replace(/\b\d{10,12}\b/g, "[PHONE_NUMBER]") // Phone numbers
      .replace(/\b[A-Z]{5}\d{4}[A-Z]\b/g, "[PAN_NUMBER]") // PAN numbers
      .replace(/\b\d{12}\b/g, "[AADHAAR_NUMBER]") // Aadhaar numbers
  }

  private categorizeQuery(query: string): string {
    const lowerQuery = query.toLowerCase()

    if (/mutual fund|sip|nav|expense ratio/i.test(query)) return "mutual_fund"
    if (/gold|silver|commodity/i.test(query)) return "gold"
    if (/real estate|property|rera/i.test(query)) return "real_estate"
    if (/insurance|lic|ulip/i.test(query)) return "insurance"
    if (/tax|ltcg|stcg|section 80c/i.test(query)) return "tax"

    return "general"
  }

  private getAgeGroup(age: number): string {
    if (age < 25) return "18-25"
    if (age < 35) return "25-35"
    if (age < 45) return "35-45"
    if (age < 55) return "45-55"
    return "55+"
  }

  private persistLogs(): void {
    if (typeof window !== "undefined") {
      try {
        // Store only last 1000 logs in localStorage to avoid quota issues
        const recentLogs = this.logs.slice(-1000)
        localStorage.setItem("arthagpt_audit_logs", JSON.stringify(recentLogs))
      } catch (error) {
        console.warn("Failed to persist audit logs:", error)
      }
    }
  }

  private async sendToSecureLogging(log: AuditLog): Promise<void> {
    // In production, send high-severity logs to secure logging service
    try {
      // await fetch('/api/audit/log', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(log)
      // })
      console.log("High-severity audit log:", log)
    } catch (error) {
      console.error("Failed to send audit log:", error)
    }
  }

  // Load persisted logs on initialization
  loadPersistedLogs(): void {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("arthagpt_audit_logs")
        if (stored) {
          const logs = JSON.parse(stored)
          this.logs = Array.isArray(logs) ? logs : []
        }
      } catch (error) {
        console.warn("Failed to load persisted audit logs:", error)
        this.logs = []
      }
    }
  }
}

// Export singleton instance
export const auditLogger = new AuditLogger()

// Initialize on load
if (typeof window !== "undefined") {
  auditLogger.loadPersistedLogs()
}

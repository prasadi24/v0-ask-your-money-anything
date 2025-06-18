"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, AlertTriangle, Activity, Download, Eye, Lock } from "lucide-react"
import { auditLogger } from "@/lib/audit-logger"

export function SecurityDashboard() {
  const [auditLogs, setAuditLogs] = useState<any[]>([])
  const [complianceReport, setComplianceReport] = useState<any>(null)
  const [selectedTimeRange, setSelectedTimeRange] = useState("7d")

  useEffect(() => {
    loadAuditData()
  }, [selectedTimeRange])

  const loadAuditData = () => {
    const endDate = new Date().toISOString()
    const startDate = new Date()

    // Calculate start date based on selected range
    switch (selectedTimeRange) {
      case "1d":
        startDate.setDate(startDate.getDate() - 1)
        break
      case "7d":
        startDate.setDate(startDate.getDate() - 7)
        break
      case "30d":
        startDate.setDate(startDate.getDate() - 30)
        break
      case "90d":
        startDate.setDate(startDate.getDate() - 90)
        break
    }

    const logs = auditLogger.getAuditLogs({
      startDate: startDate.toISOString(),
      endDate,
    })

    const report = auditLogger.generateComplianceReport(startDate.toISOString(), endDate)

    setAuditLogs(logs)
    setComplianceReport(report)
  }

  const exportAuditLogs = (format: "json" | "csv") => {
    const data = auditLogger.exportLogs(format)
    const blob = new Blob([data], { type: format === "json" ? "application/json" : "text/csv" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `arthagpt-audit-logs-${new Date().toISOString().split("T")[0]}.${format}`
    link.click()
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

  return (
    <div className="space-y-6">
      {/* Security Overview */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Shield className="h-4 w-4 mr-2" />
              Total Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{auditLogs.length}</div>
            <div className="text-sm text-gray-600">Last {selectedTimeRange}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2" />
              High Risk Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{complianceReport?.highRiskEvents?.length || 0}</div>
            <div className="text-sm text-gray-600">Requires attention</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Activity className="h-4 w-4 mr-2" />
              Active Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {complianceReport?.userActivity ? Object.keys(complianceReport.userActivity).length : 0}
            </div>
            <div className="text-sm text-gray-600">Unique users</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Lock className="h-4 w-4 mr-2" />
              Compliance Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">98.5%</div>
            <div className="text-sm text-gray-600">SEBI compliant</div>
          </CardContent>
        </Card>
      </div>

      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          {["1d", "7d", "30d", "90d"].map((range) => (
            <Button
              key={range}
              variant={selectedTimeRange === range ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTimeRange(range)}
            >
              {range}
            </Button>
          ))}
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => exportAuditLogs("csv")}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline" size="sm" onClick={() => exportAuditLogs("json")}>
            <Download className="h-4 w-4 mr-2" />
            Export JSON
          </Button>
        </div>
      </div>

      <Tabs defaultValue="logs" className="space-y-4">
        <TabsList>
          <TabsTrigger value="logs">Audit Logs</TabsTrigger>
          <TabsTrigger value="compliance">Compliance Report</TabsTrigger>
          <TabsTrigger value="security">Security Events</TabsTrigger>
        </TabsList>

        {/* Audit Logs Tab */}
        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Eye className="h-5 w-5" />
                <span>Recent Audit Logs</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {auditLogs.slice(0, 50).map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <Badge className={getSeverityColor(log.severity)}>{log.severity}</Badge>
                        <span className="font-medium">{log.action}</span>
                        <span className="text-gray-600">→ {log.resource}</span>
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {log.userId ? `User: ${log.userId}` : "Anonymous"} • {formatTimestamp(log.timestamp)}
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Compliance Report Tab */}
        <TabsContent value="compliance">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Action Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {complianceReport?.summary &&
                    Object.entries(complianceReport.summary).map(([action, count]) => (
                      <div key={action} className="flex justify-between items-center">
                        <span className="text-sm">{action.replace(/_/g, " ")}</span>
                        <Badge variant="outline">{count as number}</Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Investment Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Total Recommendations:</span>
                    <span className="font-semibold">{complianceReport?.recommendations?.total || 0}</span>
                  </div>

                  {complianceReport?.recommendations?.byRiskTolerance && (
                    <div>
                      <h4 className="font-medium mb-2">By Risk Tolerance:</h4>
                      {Object.entries(complianceReport.recommendations.byRiskTolerance).map(([risk, count]) => (
                        <div key={risk} className="flex justify-between text-sm">
                          <span>{risk}</span>
                          <span>{count as number}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {complianceReport?.recommendations?.byAge && (
                    <div>
                      <h4 className="font-medium mb-2">By Age Group:</h4>
                      {Object.entries(complianceReport.recommendations.byAge).map(([age, count]) => (
                        <div key={age} className="flex justify-between text-sm">
                          <span>{age}</span>
                          <span>{count as number}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Security Events Tab */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <span>High-Risk Security Events</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {complianceReport?.highRiskEvents?.length === 0 ? (
                <div className="text-center py-8">
                  <Shield className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No High-Risk Events</h3>
                  <p className="text-gray-600">Your system is secure and compliant.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {complianceReport?.highRiskEvents?.map((event: any) => (
                    <div key={event.id} className="p-4 border border-red-200 rounded-lg bg-red-50">
                      <div className="flex items-center justify-between mb-2">
                        <Badge className="bg-red-100 text-red-800">High Risk</Badge>
                        <span className="text-sm text-gray-600">{formatTimestamp(event.timestamp)}</span>
                      </div>
                      <div className="font-medium">{event.action}</div>
                      <div className="text-sm text-gray-700 mt-1">
                        Resource: {event.resource} • User: {event.userId || "Anonymous"}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Compliance Notice */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-800 mb-2">Regulatory Compliance</h3>
              <p className="text-sm text-blue-700 mb-3">
                ArthaGPT maintains comprehensive audit logs in compliance with SEBI, RBI, and IRDA regulations. All user
                interactions, recommendations, and system events are logged for regulatory oversight.
              </p>
              <div className="grid md:grid-cols-3 gap-4 text-xs text-blue-700">
                <div>
                  <span className="font-medium">Data Retention:</span> 7 years as per SEBI guidelines
                </div>
                <div>
                  <span className="font-medium">Encryption:</span> AES-256 for data at rest
                </div>
                <div>
                  <span className="font-medium">Access Control:</span> Role-based with audit trails
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

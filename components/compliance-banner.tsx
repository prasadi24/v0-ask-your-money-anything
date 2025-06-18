"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Shield, FileText, X, ExternalLink } from "lucide-react"

export function ComplianceBanner() {
  const [isVisible, setIsVisible] = useState(true)
  const [showDetails, setShowDetails] = useState(false)

  if (!isVisible) return null

  return (
    <Card className="border-yellow-200 bg-yellow-50">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="font-semibold text-yellow-800">Important Regulatory Disclaimer</h3>
                <Badge variant="outline" className="text-xs border-yellow-300 text-yellow-700">
                  SEBI Compliance
                </Badge>
              </div>

              <p className="text-sm text-yellow-700 mb-3">
                ArthaGPT provides educational information only. This is not personalized investment advice. Please
                consult with a SEBI-registered financial advisor before making investment decisions.
              </p>

              {!showDetails && (
                <Button
                  variant="link"
                  onClick={() => setShowDetails(true)}
                  className="text-yellow-700 p-0 h-auto text-sm"
                >
                  View detailed disclaimers
                </Button>
              )}

              {showDetails && (
                <div className="space-y-3 mt-3">
                  <div className="grid md:grid-cols-2 gap-4 text-xs text-yellow-700">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Shield className="h-3 w-3" />
                        <span className="font-medium">Investment Risks</span>
                      </div>
                      <ul className="space-y-1 ml-5">
                        <li>• Mutual funds are subject to market risks</li>
                        <li>• Past performance does not guarantee future returns</li>
                        <li>• Gold prices can be volatile</li>
                        <li>• Real estate investments have liquidity constraints</li>
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-3 w-3" />
                        <span className="font-medium">Regulatory Information</span>
                      </div>
                      <ul className="space-y-1 ml-5">
                        <li>• SEBI registration required for investment advice</li>
                        <li>• Tax implications vary by individual circumstances</li>
                        <li>• RERA registration mandatory for real estate projects</li>
                        <li>• Insurance products regulated by IRDA</li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2 border-t border-yellow-200">
                    <Button variant="link" className="text-xs text-yellow-700 p-0 h-auto">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      SEBI Investor Awareness
                    </Button>
                    <Button variant="link" className="text-xs text-yellow-700 p-0 h-auto">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      RBI Financial Education
                    </Button>
                    <Button variant="link" className="text-xs text-yellow-700 p-0 h-auto">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      IRDA Guidelines
                    </Button>
                  </div>

                  <Button
                    variant="link"
                    onClick={() => setShowDetails(false)}
                    className="text-yellow-700 p-0 h-auto text-sm"
                  >
                    Hide details
                  </Button>
                </div>
              )}
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsVisible(false)}
            className="text-yellow-600 hover:text-yellow-800"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

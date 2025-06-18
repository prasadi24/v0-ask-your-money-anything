"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  CheckCircle,
  AlertCircle,
  Clock,
  Globe,
  Shield,
  Zap,
  Database,
  Cloud,
  Settings,
  Monitor,
  Lock,
  Rocket,
} from "lucide-react"

interface DeploymentStep {
  id: string
  name: string
  status: "pending" | "running" | "completed" | "failed"
  description: string
  duration?: number
}

interface EnvironmentConfig {
  name: string
  url: string
  status: "healthy" | "warning" | "error"
  version: string
  lastDeployed: string
}

export function ProductionDeployment() {
  const [deploymentSteps, setDeploymentSteps] = useState<DeploymentStep[]>([
    {
      id: "build",
      name: "Build Application",
      status: "completed",
      description: "Compile TypeScript, bundle assets, optimize images",
      duration: 45,
    },
    {
      id: "test",
      name: "Run Tests",
      status: "completed",
      description: "Unit tests, integration tests, security scans",
      duration: 30,
    },
    {
      id: "security",
      name: "Security Scan",
      status: "completed",
      description: "Vulnerability assessment, dependency audit",
      duration: 20,
    },
    {
      id: "deploy",
      name: "Deploy to Production",
      status: "running",
      description: "Deploy to Vercel Edge Network",
      duration: 15,
    },
    {
      id: "verify",
      name: "Health Check",
      status: "pending",
      description: "Verify deployment, run smoke tests",
    },
    {
      id: "cdn",
      name: "CDN Propagation",
      status: "pending",
      description: "Global CDN cache warming",
    },
  ])

  const [environments] = useState<EnvironmentConfig[]>([
    {
      name: "Production",
      url: "https://arthagpt.vercel.app",
      status: "healthy",
      version: "v2.1.0",
      lastDeployed: "2024-03-15 14:30:00",
    },
    {
      name: "Staging",
      url: "https://arthagpt-staging.vercel.app",
      status: "healthy",
      version: "v2.1.1-beta",
      lastDeployed: "2024-03-15 12:15:00",
    },
    {
      name: "Development",
      url: "https://arthagpt-dev.vercel.app",
      status: "warning",
      version: "v2.2.0-alpha",
      lastDeployed: "2024-03-15 10:45:00",
    },
  ])

  const [deploymentProgress] = useState(75)

  const getStatusIcon = (status: DeploymentStep["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "running":
        return <Clock className="h-5 w-5 text-blue-600 animate-spin" />
      case "failed":
        return <AlertCircle className="h-5 w-5 text-red-600" />
      default:
        return <Clock className="h-5 w-5 text-gray-400" />
    }
  }

  const getStatusColor = (status: EnvironmentConfig["status"]) => {
    switch (status) {
      case "healthy":
        return "bg-green-100 text-green-800"
      case "warning":
        return "bg-yellow-100 text-yellow-800"
      case "error":
        return "bg-red-100 text-red-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Deployment Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Production Deployment</h1>
          <p className="text-gray-600">Deploy ArthaGPT to production with enterprise-grade infrastructure</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Rocket className="h-4 w-4 mr-2" />
          Deploy Now
        </Button>
      </div>

      {/* Deployment Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-blue-600" />
            <span>Deployment Progress</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm text-gray-600">{deploymentProgress}%</span>
            </div>
            <Progress value={deploymentProgress} className="h-2" />

            <div className="space-y-3">
              {deploymentSteps.map((step) => (
                <div key={step.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                  {getStatusIcon(step.status)}
                  <div className="flex-1">
                    <div className="font-medium">{step.name}</div>
                    <div className="text-sm text-gray-600">{step.description}</div>
                  </div>
                  {step.duration && (
                    <Badge variant="outline" className="text-xs">
                      {step.duration}s
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="environments" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="environments">Environments</TabsTrigger>
          <TabsTrigger value="infrastructure">Infrastructure</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        {/* Environments Tab */}
        <TabsContent value="environments">
          <div className="grid md:grid-cols-3 gap-4">
            {environments.map((env) => (
              <Card key={env.name}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between">
                    <span>{env.name}</span>
                    <Badge className={getStatusColor(env.status)}>{env.status}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4 text-gray-500" />
                      <a
                        href={env.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm"
                      >
                        {env.url}
                      </a>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-600">Version:</span> {env.version}
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-600">Last Deployed:</span> {env.lastDeployed}
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      View Logs
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Infrastructure Tab */}
        <TabsContent value="infrastructure">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Cloud className="h-5 w-5" />
                  <span>Vercel Edge Network</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <div className="font-medium">Global CDN</div>
                      <div className="text-sm text-gray-600">300+ edge locations worldwide</div>
                    </div>
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <div className="font-medium">Auto-scaling</div>
                      <div className="text-sm text-gray-600">Serverless functions</div>
                    </div>
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <div className="font-medium">SSL/TLS</div>
                      <div className="text-sm text-gray-600">Automatic HTTPS</div>
                    </div>
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="h-5 w-5" />
                  <span>Database & Storage</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <div className="font-medium">Supabase PostgreSQL</div>
                      <div className="text-sm text-gray-600">Managed database with backups</div>
                    </div>
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <div className="font-medium">Vector Storage</div>
                      <div className="text-sm text-gray-600">Document embeddings</div>
                    </div>
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <div className="font-medium">File Storage</div>
                      <div className="text-sm text-gray-600">Document uploads</div>
                    </div>
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Monitoring Tab */}
        <TabsContent value="monitoring">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Monitor className="h-5 w-5" />
                  <span>Performance Metrics</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Response Time</span>
                    <span className="font-semibold text-green-600">1.2s avg</span>
                  </div>
                  <Progress value={85} className="h-2" />

                  <div className="flex justify-between items-center">
                    <span className="text-sm">Uptime</span>
                    <span className="font-semibold text-green-600">99.9%</span>
                  </div>
                  <Progress value={99.9} className="h-2" />

                  <div className="flex justify-between items-center">
                    <span className="text-sm">Error Rate</span>
                    <span className="font-semibold text-green-600">0.1%</span>
                  </div>
                  <Progress value={0.1} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>System Health</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 border rounded">
                    <span className="text-sm">API Endpoints</span>
                    <Badge className="bg-green-100 text-green-800">Healthy</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 border rounded">
                    <span className="text-sm">Database</span>
                    <Badge className="bg-green-100 text-green-800">Connected</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 border rounded">
                    <span className="text-sm">AI Services</span>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 border rounded">
                    <span className="text-sm">Market Data</span>
                    <Badge className="bg-yellow-100 text-yellow-800">Limited</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Security Features</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <div className="font-medium">HTTPS Encryption</div>
                      <div className="text-sm text-gray-600">TLS 1.3 with automatic certificates</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <div className="font-medium">Authentication</div>
                      <div className="text-sm text-gray-600">Supabase Auth with OAuth</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <div className="font-medium">Data Encryption</div>
                      <div className="text-sm text-gray-600">AES-256 encryption at rest</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <div className="font-medium">Audit Logging</div>
                      <div className="text-sm text-gray-600">Comprehensive activity tracking</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lock className="h-5 w-5" />
                  <span>Compliance</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="font-medium">SEBI Guidelines</div>
                      <div className="text-sm text-gray-600">Investment advisory compliance</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="font-medium">Data Protection</div>
                      <div className="text-sm text-gray-600">GDPR & Indian privacy laws</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="font-medium">Financial Regulations</div>
                      <div className="text-sm text-gray-600">RBI & IRDA compliance</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="font-medium">Audit Trail</div>
                      <div className="text-sm text-gray-600">7-year data retention</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Deployment Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Production Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Environment Variables</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>SUPABASE_URL</span>
                  <Badge variant="outline">✓ Set</Badge>
                </div>
                <div className="flex justify-between">
                  <span>SUPABASE_ANON_KEY</span>
                  <Badge variant="outline">✓ Set</Badge>
                </div>
                <div className="flex justify-between">
                  <span>GROQ_API_KEY</span>
                  <Badge variant="outline">✓ Set</Badge>
                </div>
                <div className="flex justify-between">
                  <span>OPENAI_API_KEY</span>
                  <Badge variant="outline">✓ Set</Badge>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Build Configuration</h3>
              <div className="space-y-2 text-sm">
                <div>Framework: Next.js 14</div>
                <div>Node.js: 18.x</div>
                <div>Build Command: next build</div>
                <div>Output Directory: .next</div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Domain Configuration</h3>
              <div className="space-y-2 text-sm">
                <div>Primary: arthagpt.com</div>
                <div>SSL: Auto-managed</div>
                <div>CDN: Global Edge Network</div>
                <div>Analytics: Vercel Analytics</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

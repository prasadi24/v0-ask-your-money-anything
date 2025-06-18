"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Mail, Lock, User, Chrome, Coins, Shield, CheckCircle, Star } from "lucide-react"
import { authHelpers } from "@/lib/supabase-client"

interface EnhancedAuthModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function EnhancedAuthModal({ isOpen, onClose, onSuccess }: EnhancedAuthModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [signUpData, setSignUpData] = useState({
    email: "",
    password: "",
    fullName: "",
    phone: "",
    acceptTerms: false,
  })

  const [signInData, setSignInData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })

  if (!isOpen) return null

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (!signUpData.acceptTerms) {
      setError("Please accept the terms and conditions")
      setLoading(false)
      return
    }

    try {
      const { data, error } = await authHelpers.signUp(signUpData.email, signUpData.password, signUpData.fullName)

      if (error) throw error

      if (data.user) {
        setSuccess("Account created successfully! Please check your email for verification.")
        setTimeout(() => {
          onSuccess()
          onClose()
        }, 2000)
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data, error } = await authHelpers.signIn(signInData.email, signInData.password)

      if (error) throw error

      if (data.user) {
        setSuccess("Welcome back!")
        setTimeout(() => {
          onSuccess()
          onClose()
        }, 1000)
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setLoading(true)
    setError(null)

    try {
      const { error } = await authHelpers.signInWithGoogle()
      if (error) throw error
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Coins className="h-10 w-10 text-artha-500" />
            <div>
              <CardTitle className="text-3xl">ArthaGPT</CardTitle>
              <Badge variant="outline" className="mt-1">
                Your Financial Wisdom Assistant
              </Badge>
            </div>
          </div>
          <CardDescription className="text-base">
            Join thousands of investors who trust ArthaGPT for personalized financial advice
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="signin" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Create Account</TabsTrigger>
            </TabsList>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {success && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <p className="text-sm text-green-800">{success}</p>
                </div>
              </div>
            )}

            <TabsContent value="signin" className="space-y-4">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="Enter your email"
                      className="pl-10"
                      value={signInData.email}
                      onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="signin-password"
                      type="password"
                      placeholder="Enter your password"
                      className="pl-10"
                      value={signInData.password}
                      onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={signInData.rememberMe}
                      onChange={(e) => setSignInData({ ...signInData, rememberMe: e.target.checked })}
                    />
                    <span className="text-sm">Remember me</span>
                  </label>
                  <Button variant="link" className="text-sm p-0">
                    Forgot password?
                  </Button>
                </div>

                <Button type="submit" className="w-full bg-indigo-800 hover:bg-indigo-900" disabled={loading}>
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4">
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="text-center p-2 bg-blue-50 rounded">
                  <Shield className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                  <p className="text-xs">Secure</p>
                </div>
                <div className="text-center p-2 bg-green-50 rounded">
                  <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-1" />
                  <p className="text-xs">Verified</p>
                </div>
                <div className="text-center p-2 bg-yellow-50 rounded">
                  <Star className="h-6 w-6 text-yellow-600 mx-auto mb-1" />
                  <p className="text-xs">Trusted</p>
                </div>
              </div>

              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Enter your full name"
                      className="pl-10"
                      value={signUpData.fullName}
                      onChange={(e) => setSignUpData({ ...signUpData, fullName: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="Enter your email"
                      className="pl-10"
                      value={signUpData.email}
                      onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Create a strong password"
                      className="pl-10"
                      value={signUpData.password}
                      onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-600">Minimum 8 characters with letters and numbers</p>
                </div>

                <div className="space-y-3">
                  <label className="flex items-start space-x-2">
                    <input
                      type="checkbox"
                      checked={signUpData.acceptTerms}
                      onChange={(e) => setSignUpData({ ...signUpData, acceptTerms: e.target.checked })}
                      className="mt-1"
                    />
                    <span className="text-sm">
                      I agree to the{" "}
                      <Button variant="link" className="text-sm p-0 h-auto">
                        Terms of Service
                      </Button>{" "}
                      and{" "}
                      <Button variant="link" className="text-sm p-0 h-auto">
                        Privacy Policy
                      </Button>
                    </span>
                  </label>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-indigo-800 hover:bg-indigo-900"
                  disabled={loading || !signUpData.acceptTerms}
                >
                  {loading ? "Creating account..." : "Create Account"}
                </Button>
              </form>
            </TabsContent>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <Button variant="outline" onClick={handleGoogleSignIn} disabled={loading} className="w-full">
              <Chrome className="mr-2 h-4 w-4" />
              Google
            </Button>

            <div className="text-center space-y-2">
              <Button variant="ghost" onClick={onClose} className="text-sm">
                Continue as Guest
              </Button>
              <p className="text-xs text-gray-500">
                🔒 Your data is encrypted and secure. We never share your financial information.
              </p>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

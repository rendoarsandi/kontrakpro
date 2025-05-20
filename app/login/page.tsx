"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Bell, Eye, EyeOff, FileText, Loader2, Shield, Lock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Login failed')
      }

      // Simpan token di localStorage
      localStorage.setItem('token', data.token)
      
      // Redirect ke dashboard
      router.push("/dashboard")
    } catch (error: any) {
      console.error('Login failed:', error)
      // Tambahkan toast atau alert untuk menampilkan error
    } finally {
      setIsLoading(false)
    }
  }

  // Tambahkan fungsi mock login
  const handleMockLogin = async () => {
    try {
      // Set mock token dan user data
      localStorage.setItem('token', 'mock-token-123')
      localStorage.setItem('user', JSON.stringify({
        id: 'mock-user-123',
        email: 'demo@kontrakpro.com',
        name: 'Demo User',
        organization: {
          id: 'mock-org-123',
          name: 'Demo Organization'
        }
      }))
      
      console.log('Mock login successful, redirecting to dashboard...')
      
      // Gunakan await untuk memastikan redirect selesai
      await router.push('/dashboard')
      
      // Refresh halaman untuk memastikan perubahan state
      router.refresh()
    } catch (error) {
      console.error('Error during mock login:', error)
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left side - Login form */}
      <div className="flex w-full flex-col justify-center px-4 py-12 md:w-1/2 md:px-6 lg:px-8 xl:px-12">
        <div className="mx-auto w-full max-w-md">
          <div className="flex items-center gap-2 mb-8">
            <FileText className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">KontrakPro</span>
          </div>

          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">Login</CardTitle>
              <CardDescription>Enter your credentials to access your account</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                    </Button>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" />
                  <Label
                    htmlFor="remember"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Remember me
                  </Label>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>
              </form>

              <div className="mt-4">
                <Separator className="my-4" />
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full"
                  onClick={handleMockLogin}
                >
                  Demo Login (Mock)
                </Button>
              </div>

              <div className="mt-4 text-center text-sm">
                Don't have an account?{" "}
                <Link href="/signup" className="text-primary hover:underline">
                  Sign up
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right side - Image */}
      <div className="hidden bg-muted md:block md:w-1/2">
        <div className="flex h-full items-center justify-center bg-primary-foreground p-8">
          <div className="max-w-md space-y-8">
            {/* Hero Section */}
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Streamline Your Contract Management
              </h1>
              <p className="text-muted-foreground text-lg">
                KontrakPro helps you manage the entire contract lifecycle from creation to renewal, saving time and
                reducing risk.
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-background/50 backdrop-blur-sm">
                <FileText className="h-8 w-8 text-primary mb-2" />
                <h3 className="font-semibold mb-1">Smart Templates</h3>
                <p className="text-sm text-muted-foreground">Create contracts quickly with AI-powered templates</p>
              </div>
              <div className="p-4 rounded-lg bg-background/50 backdrop-blur-sm">
                <Eye className="h-8 w-8 text-primary mb-2" />
                <h3 className="font-semibold mb-1">Real-time Tracking</h3>
                <p className="text-sm text-muted-foreground">Monitor contract status and approvals instantly</p>
              </div>
              <div className="p-4 rounded-lg bg-background/50 backdrop-blur-sm">
                <Bell className="h-8 w-8 text-primary mb-2" />
                <h3 className="font-semibold mb-1">Smart Alerts</h3>
                <p className="text-sm text-muted-foreground">Never miss important deadlines with automated reminders</p>
              </div>
              <div className="p-4 rounded-lg bg-background/50 backdrop-blur-sm">
                <FileText className="h-8 w-8 text-primary mb-2" />
                <h3 className="font-semibold mb-1">E-Signature</h3>
                <p className="text-sm text-muted-foreground">Secure digital signing for faster approvals</p>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="pt-4 border-t border-border/50">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span>ISO 27001 Certified</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  <span>End-to-end Encryption</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

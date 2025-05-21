"use client"

import * as React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Bell, Eye, EyeOff, FileText, Loader2, Shield, Lock, Chrome, Mail, KeyRound, LogIn, Zap, Brain } from "lucide-react" // Added Zap and Brain
import { supabase } from "@/lib/supabaseClient"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast" // Assuming you have a toast hook

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast() // Initialize toast
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      })

      if (error) {
        throw error
      }

      if (data.session) {
        toast({
          title: "Login Successful",
          description: "Welcome back! Redirecting to dashboard...",
        })
        router.push("/dashboard")
      } else {
        console.error('Login successful but no session data received.')
        toast({
          title: "Login Error",
          description: "Login seemed successful but no session was created. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      console.error('Login failed:', error.message)
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials or server error. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      if (error) {
        console.error('Google login error:', error.message);
        toast({
          title: "Google Login Error",
          description: error.message || "Could not initiate Google login. Please try again.",
          variant: "destructive",
        })
      }
      // Supabase handles redirection
    } catch (error: any) {
      console.error('Google login failed:', error);
      toast({
        title: "Google Login Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      // setIsLoading(false); // Loader should ideally persist until redirection or clear error
    }
  };

  const handleMockLogin = async () => {
    setIsLoading(true);
    try {
      localStorage.setItem('token', 'mock-token-123')
      localStorage.setItem('user', JSON.stringify({
        id: '646e21b8-e468-4907-836b-d2a78e4d3eb3',
        email: 'mockuser@example.com',
        name: 'Mock User',
        organization: { 
          id: '86c31277-cba9-4413-9105-5e7a7e62b0d9',
          name: 'Mock Organization Inc.'
        }
      }))
      
      toast({
        title: "Demo Login Successful",
        description: "Redirecting to dashboard...",
      })
      router.push('/dashboard')
    } catch (error) {
      console.error('Error during mock login:', error)
      toast({
        title: "Demo Login Failed",
        description: "Could not perform demo login. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Left side - Login form */}
      <div className="flex w-full flex-col items-center justify-center p-4 md:w-1/2 lg:w-2/5">
        <div className="mx-auto w-full max-w-md space-y-8">
          <div className="flex flex-col items-center text-center">
            <Link href="/" className="mb-6 flex items-center gap-2">
              <FileText className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">KontrakPro</span>
            </Link>
            <h1 className="text-3xl font-bold tracking-tight">Welcome Back!</h1>
            <p className="text-muted-foreground">
              Enter your credentials to access your KontrakPro dashboard.
            </p>
          </div>

          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl">Login</CardTitle>
              <CardDescription>Use your registered email and password.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link href="/forgot-password" tabIndex={-1} className="text-sm text-primary hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="pl-10 pr-10" // Added pr-10 for eye icon
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="remember" 
                      checked={rememberMe} 
                      onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                    />
                    <Label htmlFor="remember" className="text-sm font-normal text-muted-foreground">
                      Remember me
                    </Label>
                  </div>
                </div>
                <Button type="submit" className="w-full font-semibold" disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <LogIn className="mr-2 h-4 w-4" />
                  )}
                  Login
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2">
                 <Button
                  type="button"
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2"
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                >
                  <Chrome className="h-4 w-4" />
                  Login with Google
                </Button>
                <Button 
                  type="button" 
                  variant="secondary" 
                  className="w-full"
                  onClick={handleMockLogin}
                  disabled={isLoading}
                >
                  Demo Login (Mock User)
                </Button>
              </div>
            </CardContent>
            <CardFooter className="justify-center text-sm">
              <p className="text-muted-foreground">
                Don't have an account?{" "}
                <Link href="/signup" className="font-semibold text-primary hover:underline">
                  Sign up
                </Link>
              </p>
            </CardFooter>
          </Card>
           <p className="px-8 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{" "}
            <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>

      {/* Right side - Image / Branding */}
      <div className="hidden md:flex md:w-1/2 lg:w-3/5 items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-black p-8 text-white">
        <div className="max-w-md space-y-8 text-center">
          <FileText className="mx-auto h-16 w-16 text-primary-foreground/80" />
          <h2 className="text-4xl font-bold tracking-tight">
            Unlock Efficiency in Contract Management
          </h2>
          <p className="text-lg text-primary-foreground/70">
            KontrakPro provides a secure, AI-driven platform to manage your contracts seamlessly from anywhere.
          </p>
          <div className="grid grid-cols-2 gap-6 pt-4 text-left">
            {[
              { icon: <FileText className="h-6 w-6 text-primary-foreground/80" />, text: "Centralized Repository" },
              { icon: <Zap className="h-6 w-6 text-primary-foreground/80" />, text: "Automated Workflows" },
              { icon: <Brain className="h-6 w-6 text-primary-foreground/80" />, text: "AI-Powered Insights" },
              { icon: <Shield className="h-6 w-6 text-primary-foreground/80" />, text: "Bank-Grade Security" },
            ].map(item => (
              <div key={item.text} className="flex items-center gap-3">
                {item.icon}
                <span className="font-medium">{item.text}</span>
              </div>
            ))}
          </div>
          <div className="pt-6">
            <Button variant="outline" size="lg" className="bg-transparent text-white border-white/50 hover:bg-white/10 hover:border-white" asChild>
              <Link href="/">Learn More About KontrakPro</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

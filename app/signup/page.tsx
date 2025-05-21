"use client"

import React, { useState } from "react" // Changed import type and combined with useState
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, FileText, Loader2, Chrome } from "lucide-react" // Added Chrome
import { supabase } from "@/lib/supabaseClient" // Import Supabase client

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function SignupPage() {
  const router = useRouter()
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [companySize, setCompanySize] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [signupMessage, setSignupMessage] = useState<string | null>(null) // For success/error messages

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setSignupMessage(null)

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            full_name: `${firstName} ${lastName}`, // Supabase often uses full_name
            company_name: companyName,
            company_size: companySize,
            // You can add more metadata here
          },
          // emailRedirectTo: `${window.location.origin}/auth/callback` // If you want to redirect after email confirmation
        },
      })

      if (error) {
        throw error
      }

      if (data.user && data.user.identities && data.user.identities.length === 0) {
        // This case can happen if email confirmation is required and the user already exists but is not confirmed.
        setSignupMessage("User already exists but is not confirmed. Please check your email to confirm your account or try logging in.")
      } else if (data.session) {
        // User is signed up and logged in (e.g. if email confirmation is disabled)
        // Or if you handle the session immediately after signup (less common with email confirmation)
        router.push("/dashboard")
      } else if (data.user) {
        // User is signed up, email confirmation likely required.
        setSignupMessage("Signup successful! Please check your email to confirm your account.")
        // Optionally, clear form or redirect to a "check your email" page
      } else {
        setSignupMessage("Signup successful, but no user data returned. Please check your email or try logging in.")
      }

    } catch (error: any) {
      console.error('Signup failed:', error.message)
      setSignupMessage(`Signup failed: ${error.message}`)
      // Example: toast({ title: "Signup Failed", description: error.message, variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignup = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      if (error) {
        console.error('Google signup error:', error.message);
        setSignupMessage(`Google signup failed: ${error.message}`);
      }
      // Supabase handles redirection
    } catch (error: any) {
      console.error('Google signup failed:', error);
      setSignupMessage(`Google signup failed: ${error.message || 'An unexpected error occurred.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMockSignup = () => {
    setIsLoading(true)

    // Redirect langsung ke dashboard
    setTimeout(() => {
      router.push("/dashboard")
    }, 800)
  }

  return (
    <div className="flex min-h-screen">
      {/* Left side - Signup form */}
      <div className="flex w-full flex-col justify-center px-4 py-12 md:w-1/2 md:px-6 lg:px-8 xl:px-12">
        <div className="mx-auto w-full max-w-md">
          <div className="flex items-center gap-2 mb-8">
            <FileText className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">KontrakPro</span>
          </div>

          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
              <CardDescription>Enter your information to get started with KontrakPro</CardDescription>
            </CardHeader>
            <CardContent>
              {signupMessage && (
                <div className={`mb-4 p-3 rounded-md text-sm ${signupMessage.startsWith("Signup failed:") ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                  {signupMessage}
                </div>
              )}
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first-name">First name</Label>
                    <Input
                      id="first-name"
                      placeholder="John"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last-name">Last name</Label>
                    <Input
                      id="last-name"
                      placeholder="Doe"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </div>
                </div>

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
                  <Label htmlFor="password">Password</Label>
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
                  <p className="text-xs text-muted-foreground">Password must be at least 8 characters long</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company-name">Company name</Label>
                  <Input
                    id="company-name"
                    placeholder="Acme Inc."
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company-size">Company size</Label>
                  <Select value={companySize} onValueChange={setCompanySize}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select company size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-10">1-10 employees</SelectItem>
                      <SelectItem value="11-50">11-50 employees</SelectItem>
                      <SelectItem value="51-200">51-200 employees</SelectItem>
                      <SelectItem value="201-500">201-500 employees</SelectItem>
                      <SelectItem value="501+">501+ employees</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="terms" required />
                  <Label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I agree to the{" "}
                    <Link href="/terms" className="text-primary hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-primary hover:underline">
                      Privacy Policy
                    </Link>
                  </Label>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Create account"
                  )}
                </Button>
              </form>

              <div className="mt-4">
                <Separator className="my-4" />
                <Button
                  type="button"
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2 mb-2" // Added mb-2
                  onClick={handleGoogleSignup}
                  disabled={isLoading}
                >
                  <Chrome className="h-4 w-4" />
                  Sign up with Google
                </Button>
                <Button variant="outline" className="w-full" onClick={handleMockSignup} disabled={isLoading}>
                  {isLoading && !signupMessage?.includes("Google") ? ( // Ensure loader shows for the correct action
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Redirecting...
                    </>
                  ) : (
                    "Quick Access to Dashboard (Mock Signup)"
                  )}
                </Button>
              </div>

              <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <Link href="/login" className="text-primary hover:underline">
                  Login
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right side - Image */}
      <div className="hidden bg-muted md:block md:w-1/2">
        <div className="flex h-full items-center justify-center bg-primary-foreground p-8">
          <div className="max-w-md space-y-6 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">Simplify Your Contract Management</h1>
              <p className="text-muted-foreground">
                Join thousands of companies using KontrakPro to streamline their contract processes and reduce legal
                risks.
              </p>
            </div>
            <div className="relative h-[300px] w-full overflow-hidden rounded-xl bg-gradient-to-br from-primary/20 to-muted-foreground/20">
              <div className="absolute inset-0 flex items-center justify-center">
                <FileText className="h-24 w-24 text-primary/40" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

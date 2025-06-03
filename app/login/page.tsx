"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSession, signIn, signOut } from "next-auth/react" // Ditambahkan untuk next-auth
import { Eye, EyeOff, FileSignature, Loader2, Chrome, Mail, KeyRound, LogIn } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
// import { Separator } from "@/components/ui/separator" // Separator not used in current login form logic
import { useToast } from "@/hooks/use-toast"

// Assuming window.turnstile and window.onloadTurnstileCallback and their related types (like TurnstileWidgetParams)
// are defined globally elsewhere (e.g., by another .d.ts file, a library, or tsconfig "types").
// If errors persist for these, it indicates a missing or conflicting global type definition.

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { data: session, status } = useSession() // Ditambahkan untuk next-auth
  const [isLoading, setIsLoading] = useState(false) // Tetap digunakan untuk tombol Google

  // Logika email/password dan Turnstile dihapus untuk fokus pada Google Auth

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard"); // Arahkan ke dasbor jika sudah terautentikasi
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // Jika sudah terautentikasi, idealnya sudah diarahkan, tapi sebagai fallback:
  if (session) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl">Anda Sudah Masuk</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Masuk sebagai: {session.user?.email}</p>
            <Button onClick={() => signOut()} className="w-full">
              Keluar
            </Button>
            <Button variant="outline" onClick={() => router.push('/dashboard')} className="w-full">
              Ke Dasbor
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Tampilan login jika belum terautentikasi
  return (
    <div className="flex min-h-screen w-full bg-background">
      <div className="flex w-full flex-col items-center justify-center p-4 md:w-1/2 lg:w-2/5">
        <div className="mx-auto w-full max-w-md space-y-8">
          <div className="flex flex-col items-center text-center">
            <Link href="/" className="mb-6 flex items-center gap-2">
              <FileSignature className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold animate-pulse">KontrakPro</span>
            </Link>
            <h1 className="text-3xl font-bold tracking-tight">Welcome Back!</h1>
            <p className="text-muted-foreground">
              Enter your credentials to access your KontrakPro dashboard.
            </p>
          </div>

          <Card className="shadow-xl">
            {/* Formulir login email/password dihapus, hanya menyisakan opsi Google */}
            <CardHeader>
              <CardTitle className="text-2xl">Login</CardTitle>
              <CardDescription>Gunakan akun Google Anda untuk masuk.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Bagian "Or continue with" dan tombol Google */}
              <div className="relative mt-6"> {/* Memberi sedikit ruang jika form sebelumnya ada */}
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    Masuk dengan
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2 pt-4"> {/* Menambahkan padding top */}
                 <Button
                  type="button"
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2"
                  onClick={() => {
                    console.log("Attempting Google Login..."); // LOGGING
                    setIsLoading(true); // Set loading sebelum memanggil signIn
                    signIn("google", { callbackUrl: "/dashboard" });
                  }}
                  disabled={isLoading} // Hanya bergantung pada isLoading lokal
                >
                  {isLoading ? ( // Hanya bergantung pada isLoading lokal
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Chrome className="mr-2 h-4 w-4" />
                  )}
                  Masuk dengan Google
                </Button>
              </div>
            </CardContent>
            <CardFooter className="justify-center text-sm">
              <p className="text-muted-foreground">
                Belum punya akun?{" "}
                <Link href="/signup" className="font-semibold text-primary hover:underline">
                  Daftar
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

      <div className="hidden md:flex md:w-1/2 lg:w-3/5 items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-black p-8 text-white">
        <div className="max-w-md space-y-8 text-center">
          <FileSignature className="mx-auto h-16 w-16 text-slate-400" />
          <h2 className="text-4xl font-bold tracking-tight">
            Unlock Efficiency in Contract Management
          </h2>
          <p className="text-lg text-slate-300">
            KontrakPro provides a secure, AI-driven platform to manage your contracts seamlessly from anywhere.
          </p>
        </div>
      </div>
    </div>
  )
}

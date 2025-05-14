import Link from "next/link"
import { ArrowRight, CheckCircle, FileText, Shield, Users } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
          <div className="flex gap-6 md:gap-10">
            <Link href="/" className="flex items-center space-x-2">
              <FileText className="h-6 w-6 text-primary" />
              <span className="inline-block font-bold">KontrakPro</span>
            </Link>
            <nav className="hidden gap-6 md:flex">
              <Link
                href="#features"
                className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Features
              </Link>
              <Link
                href="#pricing"
                className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Pricing
              </Link>
              <Link
                href="#about"
                className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                About
              </Link>
              <Link
                href="#contact"
                className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Contact
              </Link>
            </nav>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="flex items-center space-x-2">
              <Link
                href="/login"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Login
              </Link>
              <Button asChild>
                <Link href="/signup">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Streamline Your Contract Management
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    KontrakPro helps you manage the entire contract lifecycle from creation to renewal, saving time and
                    reducing risk.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg">
                    <Link href="/signup">
                      Start Free Trial
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg">
                    <Link href="/demo">Request Demo</Link>
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative h-[450px] w-full overflow-hidden rounded-xl bg-muted p-4">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-muted-foreground/20 opacity-50" />
                  <div className="relative z-10 flex h-full flex-col items-center justify-center space-y-8 text-center">
                    <div className="space-y-2">
                      <h2 className="text-2xl font-bold">Powerful Contract Management</h2>
                      <p className="text-muted-foreground">
                        Create, negotiate, approve, and store contracts in one secure platform
                      </p>
                    </div>
                    <div className="grid w-full max-w-sm gap-2">
                      <div className="flex items-center space-x-2 rounded-md bg-background/80 p-3 backdrop-blur">
                        <CheckCircle className="h-5 w-5 text-primary" />
                        <div className="text-sm font-medium">Automated Workflows</div>
                      </div>
                      <div className="flex items-center space-x-2 rounded-md bg-background/80 p-3 backdrop-blur">
                        <CheckCircle className="h-5 w-5 text-primary" />
                        <div className="text-sm font-medium">AI-Powered Contract Analysis</div>
                      </div>
                      <div className="flex items-center space-x-2 rounded-md bg-background/80 p-3 backdrop-blur">
                        <CheckCircle className="h-5 w-5 text-primary" />
                        <div className="text-sm font-medium">Secure Document Storage</div>
                      </div>
                      <div className="flex items-center space-x-2 rounded-md bg-background/80 p-3 backdrop-blur">
                        <CheckCircle className="h-5 w-5 text-primary" />
                        <div className="text-sm font-medium">Real-time Collaboration</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Key Features</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Everything you need to manage your contracts from start to finish
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <FileText className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Contract Creation</h3>
                <p className="text-center text-muted-foreground">
                  Create contracts using customizable templates or build from scratch with our intuitive editor
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Approval Workflows</h3>
                <p className="text-center text-muted-foreground">
                  Design custom approval workflows to ensure the right stakeholders review and sign off on contracts
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Secure Storage</h3>
                <p className="text-center text-muted-foreground">
                  Store all your contracts in a secure, centralized repository with advanced access controls
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full border-t items-center px-4 md:px-6">
        <p className="text-xs text-muted-foreground">© 2025 KontrakPro. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4">
            Terms of Service
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}

import Link from "next/link";
import { ArrowRight, FileText, Shield, Users, Zap, Brain, Briefcase, Check } from "lucide-react"; // Added Check
import { Button } from "@/components/ui/button";
import { LandingHeader } from "@/components/layout/landing-header";
import { cn } from "@/lib/utils"; // Import cn utility

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
      <LandingHeader />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full overflow-hidden bg-background py-16 md:py-28 lg:py-36">
          <div className="container mx-auto flex max-w-screen-lg flex-col items-center gap-6 px-4 text-center md:gap-10 md:px-6">
            <div className="flex max-w-3xl flex-col items-center gap-4">
              <h1 className="text-4xl font-extrabold leading-tight tracking-tighter md:text-6xl lg:text-7xl">
                Revolutionize Your{" "}
                <span className="bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent">
                  Contract Workflow
                </span>
              </h1>
              <p className="max-w-2xl text-lg text-muted-foreground sm:text-xl">
                KontrakPro empowers your business with AI-driven contract lifecycle management. From creation and e-signatures to intelligent analysis and CRM integration, streamline every step with confidence.
              </p>
            </div>
            <div className="flex flex-col gap-4 min-[400px]:flex-row">
              <Button size="lg" className="h-12 px-8 text-base">
                <Link href="/signup" className="flex items-center">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="h-12 px-8 text-base">
                <Link href="/demo">Request Demo</Link>
              </Button>
            </div>
            <div className="mx-auto mt-8 w-full max-w-4xl overflow-hidden rounded-xl border shadow-2xl dark:shadow-primary/20">
              <div className="relative aspect-[16/9] overflow-hidden rounded-lg bg-muted dark:bg-slate-800/50">
                {/* Replace with a more engaging image or a short video/animation */}
                <img
                  src="/placeholder.svg" // Consider a dynamic image or illustration here
                  alt="KontrakPro Platform Showcase"
                  className="h-full w-full object-cover opacity-80 dark:opacity-60"
                  width={1920}
                  height={1080}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/30 via-transparent to-transparent dark:from-slate-950/50" />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-16 md:py-24 lg:py-32 bg-muted/30 dark:bg-slate-900/70">
          <div className="container mx-auto max-w-screen-lg px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12 md:mb-16">
              <div className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
                Key Features
              </div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-foreground">
                Everything You Need, Intelligently Managed
              </h2>
              <p className="max-w-3xl text-muted-foreground md:text-xl/relaxed">
                KontrakPro offers a comprehensive suite of tools to automate and optimize your contract processes, enhanced with cutting-edge AI for unparalleled efficiency and insight.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 md:gap-8">
              {[
                { 
                  icon: FileText, 
                  title: "Contract Lifecycle Management", 
                  description: "Full control from creation, templating, and versioning to secure storage and easy export (PDF, HTML)."
                },
                { 
                  icon: Users, 
                  title: "Configurable Workflows", 
                  description: "Automate approvals with customizable workflows, notifications, reminders, and task delegation."
                },
                { 
                  icon: Zap, 
                  title: "E-Signature Integration", 
                  description: "Seamlessly integrate electronic signatures with identity verification and secure audit trails for faster closures."
                },
                { 
                  icon: Shield, 
                  title: "Analytics & Reporting", 
                  description: "Gain insights with dashboards, customizable reports, risk analysis, and compliance tracking."
                },
                { 
                  icon: Briefcase, 
                  title: "CRM Integration", 
                  description: "Synchronize contract data with your CRM, enabling two-way data mapping and automated triggers."
                },
                { 
                  icon: Brain, 
                  title: "AI-Powered Analysis", 
                  description: "Leverage AI for automated risk analysis, key clause extraction, language recommendations, and anomaly detection."
                }
              ].map((feature, index) => (
                <div 
                  key={index}
                  className="flex flex-col items-start space-y-3 rounded-xl border bg-card p-6 shadow-lg transition-all hover:shadow-xl dark:bg-slate-800/60 dark:hover:bg-slate-800"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-3">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-card-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="w-full py-16 md:py-24 lg:py-32 bg-background">
          <div className="container mx-auto max-w-screen-md grid items-center justify-center gap-6 px-4 text-center md:px-6">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl/tight text-foreground">
                Ready to Transform Your Contract Management?
              </h2>
              <p className="mx-auto max-w-xl text-muted-foreground md:text-xl/relaxed">
                Join hundreds of businesses streamlining their legal processes with KontrakPro.
                Start your free trial today or request a personalized demo to see it in action.
              </p>
            </div>
            <div className="mx-auto w-full max-w-sm space-y-3">
              <div className="flex flex-col gap-3 min-[400px]:flex-row justify-center">
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground text-base px-8 h-12">
                  <Link href="/signup">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild className="text-base px-8 h-12">
                  <Link href="/demo">Request a Demo</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t border-border/40 bg-background">
        <div className="container mx-auto flex max-w-screen-xl flex-col items-center justify-between gap-3 py-8 px-4 sm:flex-row md:px-6">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} KontrakPro. All rights reserved.
          </p>
          <nav className="flex gap-4 sm:ml-auto sm:gap-6">
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary dark:hover:text-primary underline-offset-4 hover:underline">
              Terms of Service
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary dark:hover:text-primary underline-offset-4 hover:underline">
              Privacy
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}

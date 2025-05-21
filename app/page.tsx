import Link from "next/link";
import { ArrowRight, FileText, Shield, Users, Zap, Brain, Briefcase, Check } from "lucide-react"; // Added Check
import { Button } from "@/components/ui/button";
import { LandingHeader } from "@/components/layout/landing-header";
import { cn } from "@/lib/utils"; // Import cn utility

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-50 via-gray-100 to-slate-200 dark:from-slate-900 dark:via-slate-950 dark:to-black">
      <LandingHeader />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full overflow-hidden py-20 md:py-32 lg:py-40">
          {/* Subtle background pattern or elements */}
          <div className="absolute inset-0 -z-10 opacity-5 dark:opacity-[0.03]">
            {/* Example: SVG pattern - replace with a more suitable one */}
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="heroPattern" patternUnits="userSpaceOnUse" width="40" height="40" patternTransform="scale(2) rotate(45)"><rect x="0" y="0" width="100%" height="100%" fill="none"/><path d="M10-2.5v5M20-2.5v5M30-2.5v5M-2.5 10h5M-2.5 20h5M-2.5 30h5" stroke="currentColor" strokeWidth="1"/></pattern></defs><rect width="100%" height="100%" fill="url(#heroPattern)"/></svg>
          </div>
          <div className="container mx-auto flex max-w-screen-lg flex-col items-center gap-8 px-4 text-center md:gap-12 md:px-6">
            <div 
              className="flex max-w-3xl flex-col items-center gap-4 animate-fade-in-up" 
              style={{ animationDuration: '0.8s', animationDelay: '0.2s' }}
            >
              <h1 className="text-5xl font-extrabold leading-tight tracking-tighter md:text-6xl lg:text-7xl">
                Revolutionize Your{" "}
                <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient-pulse">
                  Contract Workflow
                </span>
              </h1>
              <p className="max-w-2xl text-lg text-slate-700 dark:text-slate-300 sm:text-xl">
                KontrakPro empowers your business with AI-driven contract lifecycle management. From creation and e-signatures to intelligent analysis and CRM integration, streamline every step with confidence.
              </p>
            </div>
            <div 
              className="flex flex-col gap-4 min-[400px]:flex-row animate-fade-in-up"
              style={{ animationDuration: '0.8s', animationDelay: '0.4s' }}
            >
              <Button size="lg" className="h-12 px-8 text-base shadow-lg hover:shadow-primary/40 transition-shadow duration-300">
                <Link href="/signup" className="flex items-center">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="h-12 px-8 text-base shadow-md hover:shadow-slate-400/30 dark:hover:shadow-white/20 transition-shadow duration-300">
                <Link href="/demo">Request Demo</Link>
              </Button>
            </div>
            <div 
              className="mx-auto mt-10 w-full max-w-4xl overflow-hidden rounded-xl border-2 border-primary/20 bg-slate-100 dark:bg-slate-800/30 shadow-2xl dark:shadow-primary/10 transform transition-all duration-500 hover:scale-[1.02] animate-fade-in-up"
              style={{ animationDuration: '0.8s', animationDelay: '0.6s' }}
            >
              <div className="relative aspect-[16/9] overflow-hidden rounded-lg">
                <img
                  src="/kontrakpro-hero-showcase.png" // Replace with your actual showcase image
                  alt="KontrakPro Platform Showcase"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" // Added group-hover for potential parent group
                  width={1920}
                  height={1080}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-100/20 via-transparent to-transparent dark:from-slate-900/40" />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-16 md:py-24 lg:py-32 bg-slate-100 dark:bg-slate-900">
          <div className="container mx-auto max-w-screen-lg px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12 md:mb-16">
              <div className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary-600 dark:text-primary-400">
                Key Features
              </div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-slate-800 dark:text-slate-100">
                Everything You Need, Intelligently Managed
              </h2>
              <p className="max-w-3xl text-slate-600 dark:text-slate-400 md:text-xl/relaxed">
                KontrakPro offers a comprehensive suite of tools to automate and optimize your contract processes, enhanced with cutting-edge AI for unparalleled efficiency and insight.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
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
                  className={cn(
                    "group flex flex-col items-start space-y-3 rounded-xl border border-slate-200 dark:border-slate-700/80",
                    "bg-white dark:bg-slate-800/70 p-6 shadow-lg transition-all duration-300",
                    "hover:shadow-2xl hover:border-primary/50 dark:hover:bg-slate-800 dark:hover:border-primary/70 hover:-translate-y-1"
                  )}
                >
                  <div className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-full mb-3",
                    "bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300"
                  )}>
                    <feature.icon className="h-6 w-6 text-primary group-hover:text-primary-600 dark:group-hover:text-primary-300 transition-colors duration-300" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100">{feature.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="w-full py-16 md:py-24 lg:py-32 bg-gradient-to-r from-primary via-purple-600 to-pink-600 text-white">
          <div className="container mx-auto max-w-screen-md grid items-center justify-center gap-8 px-4 text-center md:px-6">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl/tight text-white">
                Ready to Transform Your Contract Management?
              </h2>
              <p className="mx-auto max-w-xl text-slate-100/90 md:text-xl/relaxed">
                Join hundreds of businesses streamlining their legal processes with KontrakPro.
                Start your free trial today or request a personalized demo to see it in action.
              </p>
            </div>
            <div className="mx-auto w-full max-w-sm space-y-3">
              <div className="flex flex-col gap-3 min-[400px]:flex-row justify-center">
                <Button asChild size="lg" className="bg-white hover:bg-slate-100 text-primary text-base px-8 h-12 shadow-lg hover:shadow-xl transition-shadow">
                  <Link href="/signup">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild className="text-base px-8 h-12 border-white/80 text-white hover:bg-white/10 hover:border-white transition-colors">
                  <Link href="/demo">Request a Demo</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900">
        <div className="container mx-auto flex max-w-screen-xl flex-col items-center justify-between gap-3 py-8 px-4 sm:flex-row md:px-6">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            &copy; {new Date().getFullYear()} KontrakPro. All rights reserved.
          </p>
          <nav className="flex gap-4 sm:ml-auto sm:gap-6">
            <Link href="#" className="text-sm text-slate-600 hover:text-primary dark:text-slate-400 dark:hover:text-primary underline-offset-4 hover:underline">
              Terms of Service
            </Link>
            <Link href="#" className="text-sm text-slate-600 hover:text-primary dark:text-slate-400 dark:hover:text-primary underline-offset-4 hover:underline">
              Privacy
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}

// Add keyframes for animations if not already in globals.css
/*
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes gradient-pulse {
  0%, 100% {
    background-size: 200% 200%;
    background-position: left center;
  }
  50% {
    background-size: 200% 200%;
    background-position: right center;
  }
}

.animate-fade-in-up {
  animation: fade-in-up ease-out forwards;
}

.animate-gradient-pulse {
  animation: gradient-pulse 5s ease infinite;
}
*/

"use client"; // Required for useState, useEffect, useRef

import Link from "next/link";
// Script, useEffect, useRef, useState, useCallback (related to Turnstile) removed.
// If other functionalities in this file need them, they should be re-added.
import {
  ArrowRight,
  FileSignature, // Changed from FileText
  Shield,
  Users,
  Zap,
  Brain,
  Briefcase,
  CheckCircle,
  BarChart,
  DollarSign,
  MessageSquare,
  Star,
  Heart,
  ThumbsUp,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LandingHeader } from "@/components/layout/landing-header";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: <FileSignature className="h-8 w-8 text-primary" />,
    title: "Contract Lifecycle Management",
    description: "Full control from creation, templating, and versioning to secure storage and easy export (PDF, HTML).",
    comingSoon: false,
  },
  {
    icon: <Users className="h-8 w-8 text-primary" />,
    title: "Configurable Workflows",
    description: "Automate approvals with customizable workflows, notifications, reminders, and task delegation.",
    comingSoon: false,
  },
  {
    icon: <Zap className="h-8 w-8 text-primary" />,
    title: "E-Signature Integration",
    description: "Seamlessly integrate electronic signatures with identity verification and secure audit trails for faster closures.",
    comingSoon: false,
  },
  {
    icon: <Shield className="h-8 w-8 text-primary" />,
    title: "Analytics & Reporting",
    description: "Gain insights with dashboards, customizable reports, risk analysis, and compliance tracking.",
    comingSoon: false,
  },
  {
    icon: <Briefcase className="h-8 w-8 text-primary" />,
    title: "CRM Integration",
    description: "Synchronize contract data with your CRM, enabling two-way data mapping and automated triggers.",
    comingSoon: false,
  },
  {
    icon: <Brain className="h-8 w-8 text-primary" />,
    title: "AI-Powered Analysis",
    description: "Leverage AI for automated risk analysis, key clause extraction, language recommendations, and anomaly detection.",
    comingSoon: false,
  },
];

const testimonials = [
  {
    name: "Sarah L., Legal Operations Manager",
    avatar: "https://source.unsplash.com/100x100/?woman,professional, улыбка", // Suggested royalty-free image
    companyLogo: "https://via.placeholder.com/120x50.png?text=Company+A", // Suggested placeholder logo
    testimonial: "KontrakPro has revolutionized how we handle contracts. The AI analysis is a game-changer, saving us countless hours and improving accuracy.",
    rating: 5,
  },
  {
    name: "John B., CFO at TechStart Inc.",
    avatar: "https://source.unsplash.com/100x100/?man,professional,ceo", // Suggested royalty-free image
    companyLogo: "https://via.placeholder.com/120x50.png?text=TechStart+Inc.", // Suggested placeholder logo
    testimonial: "The workflow automation and e-signature features have significantly sped up our deal closures. Highly recommended!",
    rating: 5,
  },
  {
    name: "Maria G., Small Business Owner",
    avatar: "https://source.unsplash.com/100x100/?woman,business,owner", // Suggested royalty-free image
    companyLogo: "https://via.placeholder.com/120x50.png?text=SmallBiz+Solutions", // Suggested placeholder logo
    testimonial: "As a small business, KontrakPro provides enterprise-level features at an affordable price. The CRM integration is seamless.",
    rating: 4,
  },
];

const pricingPlans = [
  {
    name: "Starter",
    price: "$49",
    frequency: "/month",
    description: "For small teams and startups.",
    features: [
      "Up to 5 users",
      "Basic Contract Management",
      "E-Signature (100/month)",
      "Standard Workflows",
      "Email Support",
    ],
    cta: "Choose Starter",
    popular: false,
  },
  {
    name: "Professional",
    price: "$99",
    frequency: "/month",
    description: "For growing businesses.",
    features: [
      "Up to 20 users",
      "Advanced Contract Management",
      "E-Signature (500/month)",
      "Customizable Workflows",
      "AI Analysis (Basic)",
      "CRM Integration (Limited)",
      "Priority Email Support",
    ],
    cta: "Choose Professional",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    frequency: "",
    description: "For large organizations with specific needs.",
    features: [
      "Unlimited users",
      "Full Contract Lifecycle Suite",
      "Unlimited E-Signatures",
      "Advanced AI Analysis & Reporting",
      "Full CRM Integration & API Access",
      "Dedicated Account Manager",
      "24/7 Premium Support",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

export default function Home() {
  // Turnstile related state, ref, functions, and useEffect hook removed.

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Turnstile Script tag removed */}
      <LandingHeader />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full bg-gradient-to-br from-slate-50 via-gray-100 to-slate-200 dark:from-slate-900 dark:via-slate-950 dark:to-black py-24 md:py-32 lg:py-40 overflow-hidden">
          <div className="absolute inset-0 -z-10 opacity-5 dark:opacity-[0.03]">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="heroPattern" patternUnits="userSpaceOnUse" width="40" height="40" patternTransform="scale(2) rotate(45)"><rect x="0" y="0" width="100%" height="100%" fill="none"/><path d="M10-2.5v5M20-2.5v5M30-2.5v5M-2.5 10h5M-2.5 20h5M-2.5 30h5" stroke="currentColor" strokeWidth="0.5"/></pattern></defs><rect width="100%" height="100%" fill="url(#heroPattern)"/></svg>
          </div>
          <div className="container mx-auto flex max-w-screen-xl flex-col items-center gap-8 px-4 text-center md:gap-12 md:px-6">
            <Badge variant="outline" className="py-1.5 px-4 text-sm border-primary/50 text-primary animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              AI-Powered Contract Management
            </Badge>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              Revolutionize Your{" "}
              <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Contract Workflow
              </span>
            </h1>
            <p className="max-w-3xl text-lg text-muted-foreground sm:text-xl animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              KontrakPro empowers your business with AI-driven contract lifecycle management. From creation and e-signatures to intelligent analysis and CRM integration, streamline every step with confidence.
            </p>
            <div className="flex flex-col gap-4 min-[400px]:flex-row animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <Button asChild size="lg" className="h-12 px-8 text-base shadow-lg hover:shadow-primary/40 transition-shadow duration-300">
                <Link href="/signup" className="flex items-center">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 px-8 text-base shadow-md hover:shadow-accent-foreground/20 dark:hover:shadow-white/20 transition-shadow duration-300">
                <Link href="/demo">Request Demo</Link>
              </Button>
            </div>
            <div className="mx-auto mt-12 w-full max-w-5xl animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
              <Card className="overflow-hidden shadow-2xl dark:shadow-primary/10 border-primary/20">
                <CardContent className="p-0">
                  <img
                    src="https://via.placeholder.com/1200x675.png?text=KontrakPro+Platform+Showcase" // Placeholder image
                    alt="KontrakPro Platform Showcase"
                    className="h-auto w-full object-cover aspect-video"
                    width={1200}
                    height={675}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Turnstile Widget Placeholder section removed */}

        {/* Features Section */}
        <section id="features" className="w-full py-16 md:py-24 lg:py-32 bg-background">
          <div className="container mx-auto max-w-screen-xl px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12 md:mb-16">
              <Badge variant="secondary" className="py-1.5 px-4 text-sm">Key Features</Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Everything You Need, Intelligently Managed
              </h2>
              <p className="max-w-3xl text-muted-foreground md:text-xl/relaxed">
                KontrakPro offers a comprehensive suite of tools to automate and optimize your contract processes, enhanced with cutting-edge AI for unparalleled efficiency and insight.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <Card key={index} className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 animate-fade-in-up" style={{ animationDelay: `${index * 0.1 + 0.1}s` }}>
                  <CardHeader className="flex flex-row items-start gap-4 p-6 bg-muted/30 dark:bg-muted/20">
                    {feature.icon}
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-1">{feature.title}</CardTitle>
                      {feature.comingSoon && <Badge variant="outline">Coming Soon</Badge>}
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 text-sm text-muted-foreground flex-grow">
                    {feature.description}
                  </CardContent>
                  <CardFooter className="p-6 pt-0">
                     <Button variant="link" asChild className="p-0 h-auto text-primary">
                        <Link href="#features">Learn More <ArrowRight className="ml-2 h-4 w-4" /></Link>
                     </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section id="how-it-works" className="w-full py-16 md:py-24 lg:py-32 bg-muted/40 dark:bg-muted/20">
          <div className="container mx-auto max-w-screen-xl px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12 md:mb-16">
              <Badge variant="secondary" className="py-1.5 px-4 text-sm">Simple Steps</Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Get Started in Minutes
              </h2>
              <p className="max-w-2xl text-muted-foreground md:text-xl/relaxed">
                Streamline your contract management with our intuitive platform.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {[
                { num: 1, title: "Sign Up", description: "Create your account in seconds. No credit card required for trial.", icon: <Users className="h-8 w-8 text-primary" /> },
                { num: 2, title: "Upload or Create", description: "Easily upload existing contracts or create new ones using our templates.", icon: <FileSignature className="h-8 w-8 text-primary" /> },
                { num: 3, title: "Automate & Analyze", description: "Set up workflows, get AI insights, and manage your contracts efficiently.", icon: <Brain className="h-8 w-8 text-primary" /> },
              ].map((step) => (
                <Card key={step.num} className="text-center animate-fade-in-up" style={{ animationDelay: `${step.num * 0.1}s` }}>
                  <CardHeader>
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
                      {step.icon}
                    </div>
                    <CardTitle className="text-xl">{step.num}. {step.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    {step.description}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="w-full py-16 md:py-24 lg:py-32 bg-background">
          <div className="container mx-auto max-w-screen-xl px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12 md:mb-16">
              <Badge variant="secondary" className="py-1.5 px-4 text-sm">Word From Our Clients</Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Trusted by Businesses Worldwide
              </h2>
              <p className="max-w-2xl text-muted-foreground md:text-xl/relaxed">
                Hear what our satisfied customers have to say about KontrakPro.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="flex flex-col animate-fade-in-up" style={{ animationDelay: `${index * 0.1 + 0.1}s` }}>
                  <CardHeader className="pb-4">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                        <AvatarFallback>{testimonial.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                        <CardDescription>
                          <img src={testimonial.companyLogo} alt="Company Logo" className="h-5 mt-1 opacity-70" />
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow text-muted-foreground italic">
                    "{testimonial.testimonial}"
                  </CardContent>
                  <CardFooter className="pt-4">
                    <div className="flex items-center">
                      {Array(5).fill(0).map((_, i) => (
                        <Star key={i} className={cn("h-5 w-5", i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground/50")} />
                      ))}
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="w-full py-16 md:py-24 lg:py-32 bg-muted/40 dark:bg-muted/20">
          <div className="container mx-auto max-w-screen-xl px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12 md:mb-16">
              <Badge variant="secondary" className="py-1.5 px-4 text-sm">Flexible Plans</Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Pricing That Scales With You
              </h2>
              <p className="max-w-2xl text-muted-foreground md:text-xl/relaxed">
                Choose the perfect plan for your business needs. No hidden fees, cancel anytime.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 items-start">
              {pricingPlans.map((plan, index) => (
                <Card key={index} className={cn("flex flex-col animate-fade-in-up", plan.popular ? "border-2 border-primary shadow-xl dark:shadow-primary/20" : "")} style={{ animationDelay: `${index * 0.1 + 0.1}s` }}>
                  {plan.popular && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-sm">Most Popular</Badge>
                  )}
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-semibold">{plan.name}</CardTitle>
                    <div className="my-4">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      {plan.frequency && <span className="text-muted-foreground">{plan.frequency}</span>}
                    </div>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <ul className="space-y-3">
                      {plan.features.map((feature, fIndex) => (
                        <li key={fIndex} className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter className="mt-auto">
                    <Button asChild size="lg" className={cn("w-full", plan.popular ? "" : "bg-secondary text-secondary-foreground hover:bg-secondary/80")}>
                      <Link href={plan.name === 'Enterprise' ? '/contact-sales' : '/signup'}>{plan.cta}</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
             <p className="text-center text-muted-foreground mt-8 text-sm">
              Need a custom solution or have more questions? <Link href="/contact" className="text-primary hover:underline">Contact our sales team</Link>.
            </p>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="w-full py-20 md:py-28 lg:py-32 bg-gradient-to-r from-primary via-purple-600 to-pink-600 text-white dark:from-purple-700 dark:via-pink-700 dark:to-rose-700">
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
                <Button asChild size="lg" className="bg-white hover:bg-slate-100 text-primary dark:text-pink-600 text-base px-8 h-12 shadow-lg hover:shadow-xl transition-shadow">
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
      <footer className="border-t border-border bg-background">
        <div className="container mx-auto max-w-screen-xl px-4 py-12 md:px-6">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <Link href="/" className="flex items-center space-x-2 mb-4">
                <FileSignature className="h-7 w-7 text-primary" />
                <span className="text-xl font-bold animate-pulse">KontrakPro</span>
              </Link>
              <p className="text-sm text-muted-foreground max-w-xs">
                AI-powered contract lifecycle management to streamline your legal processes.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-foreground">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#features" className="text-muted-foreground hover:text-primary">Features</Link></li>
                <li><Link href="#pricing" className="text-muted-foreground hover:text-primary">Pricing</Link></li>
                <li><Link href="/integrations" className="text-muted-foreground hover:text-primary">Integrations</Link></li>
                <li><Link href="/security" className="text-muted-foreground hover:text-primary">Security</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-foreground">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="text-muted-foreground hover:text-primary">About Us</Link></li>
                <li><Link href="/careers" className="text-muted-foreground hover:text-primary">Careers</Link></li>
                <li><Link href="/blog" className="text-muted-foreground hover:text-primary">Blog</Link></li>
                <li><Link href="/contact" className="text-muted-foreground hover:text-primary">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-foreground">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/terms" className="text-muted-foreground hover:text-primary">Terms of Service</Link></li>
                <li><Link href="/privacy" className="text-muted-foreground hover:text-primary">Privacy Policy</Link></li>
                <li><Link href="/cookies" className="text-muted-foreground hover:text-primary">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          <Separator className="my-8" />
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} KontrakPro. All rights reserved.
            </p>
            <div className="flex space-x-4">
              {/* Add social media icons here if needed */}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Keyframes for animations are in globals.css

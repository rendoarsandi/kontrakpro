"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ArrowRight, FileText, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function LandingHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false); // For preventing hydration mismatch with theme

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  if (!mounted) {
    // Prevent rendering on the server to avoid hydration mismatch with theme-dependent classes
    // or render a placeholder/skeleton header
    return <div className="sticky top-0 z-50 w-full h-16 border-b border-border/40 bg-background/95" />;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 w-full max-w-screen-xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6 md:gap-8">
          <Link href="/" className="flex items-center space-x-2">
            <FileText className="h-7 w-7 text-primary" />
            <span className="inline-block text-xl font-bold text-foreground">KontrakPro</span>
          </Link>
          <nav className="hidden md:flex md:gap-6 lg:gap-8">
            {[
              { href: "#features", label: "Features" },
              { href: "#pricing", label: "Pricing" },
              { href: "#about", label: "About" },
              { href: "#contact", label: "Contact" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary dark:hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden text-sm font-medium text-muted-foreground transition-colors hover:text-primary dark:hover:text-primary md:inline-block"
          >
            Login
          </Link>
          <Button asChild size="sm" className="hidden md:inline-flex">
            <Link href="/signup">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-muted-foreground hover:text-primary hover:bg-accent"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>
      {/* Mobile Menu */}
      <div
        className={cn(
          "md:hidden border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
          mobileMenuOpen ? "block" : "hidden",
          "absolute left-0 w-full shadow-lg py-3"
        )}
      >
        <nav className="flex flex-col space-y-1 px-4">
          {[
            { href: "#features", label: "Features" },
            { href: "#pricing", label: "Pricing" },
            { href: "#about", label: "About" },
            { href: "#contact", label: "Contact" },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="block rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground dark:hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <div className="pt-2 mt-2 border-t border-border/40">
            <Link
              href="/login"
              className="block rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground dark:hover:text-primary md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            >
              Login
            </Link>
            <Button asChild className="w-full mt-2" onClick={() => setMobileMenuOpen(false)}>
              <Link href="/signup">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}

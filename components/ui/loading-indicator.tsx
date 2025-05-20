"use client"

import { cn } from "@/lib/utils"

interface LoadingIndicatorProps {
  size?: "sm" | "md" | "lg"
  className?: string
  text?: string
}

export function LoadingIndicator({ size = "md", className, text }: LoadingIndicatorProps) {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-2",
    lg: "h-12 w-12 border-3"
  }

  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <div
        className={cn(
          "animate-spin rounded-full border-b-2 border-primary",
          sizeClasses[size]
        )}
      />
      {text && <div className="mt-2 text-sm text-muted-foreground">{text}</div>}
    </div>
  )
}

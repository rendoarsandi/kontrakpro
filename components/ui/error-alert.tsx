"use client"

import { AlertCircle, X } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface ErrorAlertProps {
  title?: string
  message: string
  className?: string
  onRetry?: () => void
  dismissible?: boolean
}

export function ErrorAlert({
  title = "Terjadi Kesalahan",
  message,
  className,
  onRetry,
  dismissible = true
}: ErrorAlertProps) {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) {
    return null
  }

  return (
    <div
      className={cn(
        "relative rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 shrink-0" />
        <div className="flex-1">
          <h3 className="font-medium">{title}</h3>
          <p className="mt-1 text-sm text-destructive/90">{message}</p>
          {onRetry && (
            <Button
              variant="outline"
              size="sm"
              className="mt-3 border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={onRetry}
            >
              Coba Lagi
            </Button>
          )}
        </div>
        {dismissible && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 shrink-0 rounded-full p-0 text-destructive/70 hover:bg-destructive/10 hover:text-destructive"
            onClick={() => setDismissed(true)}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Tutup</span>
          </Button>
        )}
      </div>
    </div>
  )
}

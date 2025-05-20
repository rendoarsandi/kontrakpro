"use client"

import { ReactNode } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ErrorBoundary } from "@/components/error-boundary"
import { cn } from "@/lib/utils"

interface ChartContainerProps {
  title: string
  description?: string
  children: ReactNode
  footer?: ReactNode
  className?: string
  contentClassName?: string
  actions?: ReactNode
}

export function ChartContainer({
  title,
  description,
  children,
  footer,
  className,
  contentClassName,
  actions
}: ChartContainerProps) {
  return (
    <Card className={className}>
      <CardHeader className={actions ? "flex flex-row items-center justify-between space-y-0 pb-2" : undefined}>
        <div>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        {actions && <div className="flex items-center space-x-2">{actions}</div>}
      </CardHeader>
      <CardContent className={cn("pt-2", contentClassName)}>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </CardContent>
      {footer && <CardFooter>{footer}</CardFooter>}
    </Card>
  )
}

import type React from "react"
import { ArrowDown, ArrowUp } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface DashboardMetricCardProps {
  title: string
  value: string
  change: string
  trend: "up" | "down" | "neutral"
  trendDirection?: "positive" | "negative"
  icon?: React.ReactNode
}

export function DashboardMetricCard({
  title,
  value,
  change,
  trend,
  trendDirection = "positive",
  icon,
}: DashboardMetricCardProps) {
  // Determine if the trend is good or bad
  // By default, "up" is positive and "down" is negative
  // But for some metrics like "processing time", "down" is positive
  const isPositive =
    (trend === "up" && trendDirection === "positive") || (trend === "down" && trendDirection === "negative")

  const isNegative =
    (trend === "up" && trendDirection === "negative") || (trend === "down" && trendDirection === "positive")

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center text-xs text-muted-foreground">
          {trend === "up" && <ArrowUp className={`mr-1 h-3 w-3 ${isPositive ? "text-green-500" : "text-red-500"}`} />}
          {trend === "down" && (
            <ArrowDown className={`mr-1 h-3 w-3 ${isPositive ? "text-green-500" : "text-red-500"}`} />
          )}
          <span className={isPositive ? "text-green-500" : isNegative ? "text-red-500" : ""}>{change}</span>
          <span className="ml-1">vs previous period</span>
        </div>
      </CardContent>
    </Card>
  )
}

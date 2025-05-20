"use client"

import { useAnalytics } from "@/components/providers/analytics-provider"
import { DashboardMetricCard } from "@/components/dashboard-metric-card"

interface MetricCardWithDataProps {
  title: string
  metricKey: keyof typeof metricKeyMap
  format: "number" | "percent" | "currency" | "days"
  changeValue?: string
  trend?: "up" | "down" | "neutral"
  trendDirection?: "positive" | "negative"
  icon?: React.ReactNode
}

// Pemetaan kunci metrik ke properti dalam objek summary_metrics
const metricKeyMap = {
  total_contracts: "total_contracts",
  active_contracts: "active_contracts",
  avg_processing_time: "avg_processing_time",
  renewal_rate: "renewal_rate",
  total_value: "total_value",
  avg_contract_value: "avg_contract_value",
  contracts_expiring: "contracts_expiring",
  renewal_opportunity: "renewal_opportunity",
  avg_approval_time: "avg_approval_time",
  avg_negotiation_time: "avg_negotiation_time",
  contracts_per_user: "contracts_per_user",
  automation_rate: "automation_rate",
  high_risk_contracts: "high_risk_contracts",
  medium_risk_contracts: "medium_risk_contracts",
  avg_risk_score: "avg_risk_score",
  risk_reduction_rate: "risk_reduction_rate",
  compliance_score: "compliance_score",
  non_compliant_contracts: "non_compliant_contracts",
  compliance_issues: "compliance_issues",
  avg_resolution_time: "avg_resolution_time"
}

export function MetricCardWithData({
  title,
  metricKey,
  format,
  changeValue,
  trend,
  trendDirection,
  icon
}: MetricCardWithDataProps) {
  const { analytics, loading } = useAnalytics()

  // Mendapatkan nilai metrik dari data analitik
  const metricValue = analytics.summary_metrics[metricKeyMap[metricKey]] || 0

  // Format nilai metrik sesuai dengan tipe
  const formattedValue = formatMetricValue(metricValue, format)

  // Menghitung perubahan nilai jika tidak disediakan
  const calculatedChange = calculateChange(metricValue)
  const displayChange = changeValue || calculatedChange

  // Menentukan tren berdasarkan perubahan jika tidak disediakan
  const calculatedTrend = displayChange.startsWith("+") ? "up" : displayChange.startsWith("-") ? "down" : "neutral"
  const displayTrend = trend || calculatedTrend as "up" | "down" | "neutral"

  return (
    <DashboardMetricCard
      title={title}
      value={loading ? "Loading..." : formattedValue}
      change={displayChange}
      trend={displayTrend}
      trendDirection={trendDirection}
      icon={icon}
    />
  )
}

// Fungsi untuk menghitung perubahan nilai (dummy)
function calculateChange(value: number): string {
  // Dalam implementasi nyata, ini akan membandingkan dengan nilai sebelumnya
  // Untuk saat ini, kita gunakan nilai acak antara -15% dan +15%
  const randomChange = (Math.random() * 30 - 15).toFixed(1)
  return randomChange.startsWith("-") ? randomChange + "%" : "+" + randomChange + "%"
}

// Fungsi untuk memformat nilai metrik
function formatMetricValue(value: number, format: string): string {
  switch (format) {
    case "number":
      return value.toLocaleString()
    case "percent":
      return `${value}%`
    case "currency":
      // Format mata uang dengan lebih baik
      if (value >= 1000000) {
        return `$${(value / 1000000).toFixed(2)}M`
      } else if (value >= 1000) {
        return `$${(value / 1000).toFixed(1)}K`
      } else {
        return `$${value.toLocaleString()}`
      }
    case "days":
      return `${value.toFixed(1)} days`
    default:
      return value.toString()
  }
}

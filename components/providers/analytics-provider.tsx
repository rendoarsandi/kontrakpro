"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { api } from "@/lib/api"
import { AnalyticsResponse, SummaryMetrics } from "@/lib/types/analytics"
import { ErrorAlert } from "@/components/ui/error-alert"

// Default empty metrics
const defaultMetrics: SummaryMetrics = {
  total_contracts: 0,
  active_contracts: 0,
  avg_processing_time: 0,
  renewal_rate: 0,
  total_value: 0,
  avg_contract_value: 0,
  contracts_expiring: 0,
  renewal_opportunity: 0,
  avg_approval_time: 0,
  avg_negotiation_time: 0,
  contracts_per_user: 0,
  automation_rate: 0,
  high_risk_contracts: 0,
  medium_risk_contracts: 0,
  avg_risk_score: 0,
  risk_reduction_rate: 0,
  compliance_score: 0,
  non_compliant_contracts: 0,
  compliance_issues: 0,
  avg_resolution_time: 0
}

// Default empty analytics response
const defaultAnalytics: AnalyticsResponse = {
  summary_metrics: defaultMetrics,
  contract_status: [],
  contract_types: [],
  contract_activity: [],
  contract_value: [],
  team_performance: [],
  risk_distribution: [],
  risk_trend: [],
  compliance_score: [],
  contract_heatmap: [],
  contract_metrics: []
}

interface AnalyticsContextType {
  analytics: AnalyticsResponse
  loading: boolean
  error: string | null
  timeRange: string
  setTimeRange: (range: string) => void
  refreshData: () => Promise<void>
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined)

export function AnalyticsProvider({ children }: { children: ReactNode }) {
  const [analytics, setAnalytics] = useState<AnalyticsResponse>(defaultAnalytics)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState("last30")

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Konversi timeRange ke parameter yang sesuai
      let timePeriod = "30d"
      switch (timeRange) {
        case "last7":
          timePeriod = "7d"
          break
        case "last30":
          timePeriod = "30d"
          break
        case "last90":
          timePeriod = "90d"
          break
        case "year":
          timePeriod = "1y"
          break
        default:
          timePeriod = "30d"
      }

      const response = await api.getSummaryMetrics({ time_period: timePeriod })
      setAnalytics(response)
    } catch (err) {
      console.error("Error fetching analytics data:", err)
      setError("Failed to load analytics data. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  // Memuat data saat komponen dimount atau timeRange berubah
  useEffect(() => {
    fetchAnalyticsData()
  }, [timeRange])

  const refreshData = async () => {
    await fetchAnalyticsData()
  }

  return (
    <AnalyticsContext.Provider
      value={{
        analytics,
        loading,
        error,
        timeRange,
        setTimeRange,
        refreshData
      }}
    >
      {error && (
        <ErrorAlert
          title="Gagal Memuat Data Analitik"
          message={error}
          onRetry={refreshData}
          className="mb-4"
        />
      )}
      {children}
    </AnalyticsContext.Provider>
  )
}

export function useAnalytics() {
  const context = useContext(AnalyticsContext)
  if (context === undefined) {
    throw new Error("useAnalytics must be used within an AnalyticsProvider")
  }
  return context
}

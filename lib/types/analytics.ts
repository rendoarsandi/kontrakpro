// Tipe untuk metrik ringkasan
export interface SummaryMetrics {
  total_contracts: number
  active_contracts: number
  avg_processing_time: number
  renewal_rate: number
  total_value: number
  avg_contract_value: number
  contracts_expiring: number
  renewal_opportunity: number
  avg_approval_time: number
  avg_negotiation_time: number
  contracts_per_user: number
  automation_rate: number
  high_risk_contracts: number
  medium_risk_contracts: number
  avg_risk_score: number
  risk_reduction_rate: number
  compliance_score: number
  non_compliant_contracts: number
  compliance_issues: number
  avg_resolution_time: number
}

// Tipe untuk data status kontrak
export interface ContractStatusData {
  name: string
  value: number
  color: string
}

// Tipe untuk data tipe kontrak
export interface ContractTypeData {
  name: string
  value: number
  color: string
}

// Tipe untuk data aktivitas kontrak
export interface ContractActivityData {
  month: string
  created: number
  updated: number
  expired: number
}

// Tipe untuk data nilai kontrak
export interface ContractValueData {
  month: string
  value: number
}

// Tipe untuk data kinerja tim
export interface TeamPerformanceData {
  team: string
  avgProcessingTime: number
  avgApprovalTime: number
  contractsProcessed: number
}

// Tipe untuk data distribusi risiko
export interface RiskDistributionData {
  risk_level: string
  count: number
  color: string
}

// Tipe untuk data tren risiko
export interface RiskTrendData {
  month: string
  riskScore: number
}

// Tipe untuk data skor kepatuhan
export interface ComplianceScoreData {
  regulation: string
  score: number
}

// Tipe untuk data heatmap kontrak
export interface ContractHeatmapData {
  day: number
  hour: number
  value: number
}

// Tipe untuk data metrik kontrak
export interface ContractMetricsData {
  type: string
  count: number
  avg_value: number
  avg_duration: number
  renewal_rate: number
}

// Tipe untuk respons API analitik
export interface AnalyticsResponse {
  summary_metrics: SummaryMetrics
  contract_status: ContractStatusData[]
  contract_types: ContractTypeData[]
  contract_activity: ContractActivityData[]
  contract_value: ContractValueData[]
  team_performance: TeamPerformanceData[]
  risk_distribution: RiskDistributionData[]
  risk_trend: RiskTrendData[]
  compliance_score: ComplianceScoreData[]
  contract_heatmap: ContractHeatmapData[]
  contract_metrics: ContractMetricsData[]
}

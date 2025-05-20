"use client"
import { useEffect } from "react"
import { Calendar, Download, FileText, Filter, PieChart, RefreshCw, Search, Share2, Sliders } from "lucide-react"
import { AnalyticsProvider, useAnalytics } from "@/components/providers/analytics-provider"
import { ChartContainer } from "@/components/charts/chart-container"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ContractActivityChart } from "@/components/charts/contract-activity-chart"
import { ContractStatusChart } from "@/components/charts/contract-status-chart"
import { ContractTypeChart } from "@/components/charts/contract-type-chart"
import { ContractValueChart } from "@/components/charts/contract-value-chart"
import { RiskDistributionChart } from "@/components/charts/risk-distribution-chart"
import { TeamPerformanceChart } from "@/components/charts/team-performance-chart"
import { ContractHeatmap } from "@/components/charts/contract-heatmap"
import { RiskTrendChart } from "@/components/charts/risk-trend-chart"
import { ComplianceScoreChart } from "@/components/charts/compliance-score-chart"
import { ContractMetricsTable } from "@/components/tables/contract-metrics-table"
import { DashboardMetricCard } from "@/components/dashboard-metric-card"
import { MetricCardWithData } from "@/components/metrics/metric-card-with-data"

export default function AnalyticsDashboardPage() {
  return (
    <AnalyticsProvider>
      <AnalyticsDashboardContent />
    </AnalyticsProvider>
  )
}

function AnalyticsDashboardContent() {
  const { timeRange, setTimeRange, refreshData, loading } = useAnalytics()

  const handleRefresh = async () => {
    await refreshData()
  }

  return (
    <div className="flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <h1 className="text-lg font-semibold">Advanced Analytics</h1>
          <div className="ml-auto flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search analytics..."
                className="w-[200px] pl-8 md:w-[260px] lg:w-[320px]"
              />
            </div>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Pilih periode waktu" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last7">7 hari terakhir</SelectItem>
                <SelectItem value="last30">30 hari terakhir</SelectItem>
                <SelectItem value="last90">90 hari terakhir</SelectItem>
                <SelectItem value="year">Tahun ini</SelectItem>
                <SelectItem value="custom">Rentang kustom</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" onClick={handleRefresh} disabled={loading}>
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              <span className="sr-only">Refresh data</span>
            </Button>
            <Button variant="outline" className="gap-1">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Sliders className="h-4 w-4" />
                  <span className="sr-only">More options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Dashboard Options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Share2 className="mr-2 h-4 w-4" />
                  Share Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Filter className="mr-2 h-4 w-4" />
                  Advanced Filters
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule Reports
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-6">
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="contracts">Contracts</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
              <TabsTrigger value="compliance">Compliance</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Key Metrics Row */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <MetricCardWithData
                  title="Total Contracts"
                  metricKey="total_contracts"
                  format="number"
                  changeValue="+4.3%"
                  trend="up"
                  icon={<FileText className="h-4 w-4" />}
                />
                <MetricCardWithData
                  title="Active Contracts"
                  metricKey="active_contracts"
                  format="number"
                  changeValue="+2.1%"
                  trend="up"
                  icon={<FileText className="h-4 w-4" />}
                />
                <MetricCardWithData
                  title="Avg. Processing Time"
                  metricKey="avg_processing_time"
                  format="days"
                  changeValue="-12.5%"
                  trend="down"
                  icon={<Calendar className="h-4 w-4" />}
                  trendDirection="positive"
                />
                <MetricCardWithData
                  title="Renewal Rate"
                  metricKey="renewal_rate"
                  format="percent"
                  changeValue="+3.2%"
                  trend="up"
                  icon={<RefreshCw className="h-4 w-4" />}
                />
              </div>

              {/* Contract Activity and Type Charts */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <ChartContainer
                  title="Aktivitas Kontrak"
                  description="Jumlah kontrak yang dibuat, disetujui, dan kedaluwarsa"
                  className="lg:col-span-4"
                  actions={
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Sliders className="h-4 w-4" />
                          <span className="sr-only">Sesuaikan grafik</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Opsi Grafik</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Tampilkan Hanya yang Dibuat</DropdownMenuItem>
                        <DropdownMenuItem>Tampilkan Hanya yang Disetujui</DropdownMenuItem>
                        <DropdownMenuItem>Tampilkan Hanya yang Kedaluwarsa</DropdownMenuItem>
                        <DropdownMenuItem>Tampilkan Semua</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  }
                >
                  <ContractActivityChart className="aspect-[4/3]" />
                </ChartContainer>
                <ChartContainer
                  title="Tipe Kontrak"
                  description="Distribusi berdasarkan tipe kontrak"
                  className="lg:col-span-3"
                  actions={
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <PieChart className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Beralih antara grafik pie dan donut</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  }
                >
                  <ContractTypeChart className="aspect-[4/3]" />
                </ChartContainer>
              </div>

              {/* Risk Distribution and Contract Value */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="lg:col-span-3">
                  <CardHeader>
                    <CardTitle>Risk Distribution</CardTitle>
                    <CardDescription>Contracts by risk level</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RiskDistributionChart className="aspect-[4/3]" />
                  </CardContent>
                  <CardFooter className="flex justify-between text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Badge variant="outline" className="mr-1 bg-red-100">
                        High
                      </Badge>
                      <span>12 contracts</span>
                    </div>
                    <div className="flex items-center">
                      <Badge variant="outline" className="mr-1 bg-yellow-100">
                        Medium
                      </Badge>
                      <span>34 contracts</span>
                    </div>
                    <div className="flex items-center">
                      <Badge variant="outline" className="mr-1 bg-green-100">
                        Low
                      </Badge>
                      <span>81 contracts</span>
                    </div>
                  </CardFooter>
                </Card>
                <Card className="lg:col-span-4">
                  <CardHeader>
                    <CardTitle>Contract Value</CardTitle>
                    <CardDescription>Total value by month (USD)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ContractValueChart className="aspect-[4/3]" />
                  </CardContent>
                  <CardFooter>
                    <div className="text-sm text-muted-foreground">
                      Total contract value: <span className="font-medium text-foreground">$4,325,890</span>
                    </div>
                  </CardFooter>
                </Card>
              </div>

              {/* Contract Status and Team Performance */}
              <div className="grid gap-4 md:grid-cols-2">
                <ChartContainer
                  title="Status Kontrak"
                  description="Status saat ini dari semua kontrak"
                >
                  <ContractStatusChart className="aspect-[4/3]" />
                </ChartContainer>
                <ChartContainer
                  title="Kinerja Tim"
                  description="Efisiensi pemrosesan kontrak berdasarkan tim"
                >
                  <TeamPerformanceChart className="aspect-[4/3]" />
                </ChartContainer>
              </div>

              {/* Performance Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                  <CardDescription>Key performance indicators for contract management</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Template Usage</span>
                        </div>
                        <span className="font-medium">68%</span>
                      </div>
                      <Progress value={68} className="h-2" />
                      <p className="text-xs text-muted-foreground">Percentage of contracts created using templates</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">On-time Approvals</span>
                        </div>
                        <span className="font-medium">82%</span>
                      </div>
                      <Progress value={82} className="h-2" />
                      <p className="text-xs text-muted-foreground">Percentage of approvals completed within deadline</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Filter className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">First-time Approval Rate</span>
                        </div>
                        <span className="font-medium">75%</span>
                      </div>
                      <Progress value={75} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        Percentage of contracts approved without revisions
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Renewal Efficiency</span>
                        </div>
                        <span className="font-medium">91%</span>
                      </div>
                      <Progress value={91} className="h-2" />
                      <p className="text-xs text-muted-foreground">Percentage of contracts renewed before expiration</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contracts" className="space-y-6">
              {/* Contract Metrics */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <MetricCardWithData
                  title="Total Value"
                  metricKey="total_value"
                  format="currency"
                  icon={<FileText className="h-4 w-4" />}
                />
                <MetricCardWithData
                  title="Avg. Contract Value"
                  metricKey="avg_contract_value"
                  format="currency"
                  icon={<FileText className="h-4 w-4" />}
                />
                <MetricCardWithData
                  title="Contracts Expiring"
                  metricKey="contracts_expiring"
                  format="number"
                  icon={<Calendar className="h-4 w-4" />}
                  trendDirection="negative"
                />
                <MetricCardWithData
                  title="Renewal Opportunity"
                  metricKey="renewal_opportunity"
                  format="currency"
                  icon={<RefreshCw className="h-4 w-4" />}
                />
              </div>

              {/* Contract Heatmap */}
              <Card>
                <CardHeader>
                  <CardTitle>Contract Activity Heatmap</CardTitle>
                  <CardDescription>Contract activity by day and hour</CardDescription>
                </CardHeader>
                <CardContent>
                  <ContractHeatmap className="aspect-[16/9]" />
                </CardContent>
                <CardFooter className="text-sm text-muted-foreground">
                  Most active time: Tuesdays at 10:00 AM
                </CardFooter>
              </Card>

              {/* Contract Metrics Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Contract Metrics</CardTitle>
                  <CardDescription>Detailed metrics by contract type</CardDescription>
                </CardHeader>
                <CardContent>
                  <ContractMetricsTable />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="performance" className="space-y-6">
              {/* Performance Metrics */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <MetricCardWithData
                  title="Avg. Approval Time"
                  metricKey="avg_approval_time"
                  format="days"
                  icon={<Calendar className="h-4 w-4" />}
                  trendDirection="positive"
                />
                <MetricCardWithData
                  title="Avg. Negotiation Time"
                  metricKey="avg_negotiation_time"
                  format="days"
                  icon={<Calendar className="h-4 w-4" />}
                  trendDirection="positive"
                />
                <MetricCardWithData
                  title="Contracts per User"
                  metricKey="contracts_per_user"
                  format="number"
                  icon={<FileText className="h-4 w-4" />}
                />
                <MetricCardWithData
                  title="Automation Rate"
                  metricKey="automation_rate"
                  format="percent"
                  icon={<RefreshCw className="h-4 w-4" />}
                />
              </div>

              {/* Team Performance Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Team Performance</CardTitle>
                  <CardDescription>Contract processing efficiency by team</CardDescription>
                </CardHeader>
                <CardContent>
                  <TeamPerformanceChart className="aspect-[16/9]" />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="risk" className="space-y-6">
              {/* Risk Metrics */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <MetricCardWithData
                  title="High Risk Contracts"
                  metricKey="high_risk_contracts"
                  format="number"
                  icon={<FileText className="h-4 w-4" />}
                  trendDirection="positive"
                />
                <MetricCardWithData
                  title="Medium Risk Contracts"
                  metricKey="medium_risk_contracts"
                  format="number"
                  icon={<FileText className="h-4 w-4" />}
                  trendDirection="positive"
                />
                <MetricCardWithData
                  title="Avg. Risk Score"
                  metricKey="avg_risk_score"
                  format="number"
                  icon={<FileText className="h-4 w-4" />}
                  trendDirection="positive"
                />
                <MetricCardWithData
                  title="Risk Reduction Rate"
                  metricKey="risk_reduction_rate"
                  format="percent"
                  icon={<RefreshCw className="h-4 w-4" />}
                />
              </div>

              {/* Risk Distribution Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Risk Distribution</CardTitle>
                  <CardDescription>Contracts by risk level</CardDescription>
                </CardHeader>
                <CardContent>
                  <RiskDistributionChart className="aspect-[16/9]" />
                </CardContent>
              </Card>

              {/* Risk Trend Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Risk Trend</CardTitle>
                  <CardDescription>Average risk score over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <RiskTrendChart className="aspect-[16/9]" />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="compliance" className="space-y-6">
              {/* Compliance Metrics */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <MetricCardWithData
                  title="Compliance Score"
                  metricKey="compliance_score"
                  format="percent"
                  icon={<FileText className="h-4 w-4" />}
                />
                <MetricCardWithData
                  title="Non-compliant Contracts"
                  metricKey="non_compliant_contracts"
                  format="number"
                  icon={<FileText className="h-4 w-4" />}
                  trendDirection="positive"
                />
                <MetricCardWithData
                  title="Compliance Issues"
                  metricKey="compliance_issues"
                  format="number"
                  icon={<FileText className="h-4 w-4" />}
                  trendDirection="positive"
                />
                <MetricCardWithData
                  title="Avg. Resolution Time"
                  metricKey="avg_resolution_time"
                  format="days"
                  icon={<Calendar className="h-4 w-4" />}
                  trendDirection="positive"
                />
              </div>

              {/* Compliance Score Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Compliance Score</CardTitle>
                  <CardDescription>Compliance score by regulation</CardDescription>
                </CardHeader>
                <CardContent>
                  <ComplianceScoreChart className="aspect-[16/9]" />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

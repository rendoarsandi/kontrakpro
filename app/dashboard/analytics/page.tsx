"use client"

import { useState } from "react"
import { Calendar, Download, FileText, Filter, PieChart, RefreshCw, Search, Share2, Sliders } from "lucide-react"

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

export default function AnalyticsDashboardPage() {
  const [timeRange, setTimeRange] = useState("last30")
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    // Simulate data refresh
    setTimeout(() => {
      setIsRefreshing(false)
    }, 1500)
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
            <Select defaultValue={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select time period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last7">Last 7 days</SelectItem>
                <SelectItem value="last30">Last 30 days</SelectItem>
                <SelectItem value="last90">Last 90 days</SelectItem>
                <SelectItem value="year">This year</SelectItem>
                <SelectItem value="custom">Custom range</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
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
                <DashboardMetricCard
                  title="Total Contracts"
                  value="127"
                  change="+4.3%"
                  trend="up"
                  icon={<FileText className="h-4 w-4" />}
                />
                <DashboardMetricCard
                  title="Active Contracts"
                  value="86"
                  change="+2.1%"
                  trend="up"
                  icon={<FileText className="h-4 w-4" />}
                />
                <DashboardMetricCard
                  title="Avg. Processing Time"
                  value="4.2 days"
                  change="-12.5%"
                  trend="down"
                  icon={<Calendar className="h-4 w-4" />}
                  trendDirection="positive"
                />
                <DashboardMetricCard
                  title="Renewal Rate"
                  value="87%"
                  change="+3.2%"
                  trend="up"
                  icon={<RefreshCw className="h-4 w-4" />}
                />
              </div>

              {/* Contract Activity and Type Charts */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="lg:col-span-4">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Contract Activity</CardTitle>
                        <CardDescription>Number of contracts created, approved, and expired</CardDescription>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Sliders className="h-4 w-4" />
                            <span className="sr-only">Adjust chart</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Chart Options</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Show Created Only</DropdownMenuItem>
                          <DropdownMenuItem>Show Approved Only</DropdownMenuItem>
                          <DropdownMenuItem>Show Expired Only</DropdownMenuItem>
                          <DropdownMenuItem>Show All</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ContractActivityChart className="aspect-[4/3]" />
                  </CardContent>
                </Card>
                <Card className="lg:col-span-3">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Contract Types</CardTitle>
                        <CardDescription>Distribution by contract type</CardDescription>
                      </div>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <PieChart className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Toggle between pie and donut chart</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ContractTypeChart className="aspect-[4/3]" />
                  </CardContent>
                </Card>
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
                <Card>
                  <CardHeader>
                    <CardTitle>Contract Status</CardTitle>
                    <CardDescription>Current status of all contracts</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ContractStatusChart className="aspect-[4/3]" />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Team Performance</CardTitle>
                    <CardDescription>Contract processing efficiency by team</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <TeamPerformanceChart className="aspect-[4/3]" />
                  </CardContent>
                </Card>
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
                <DashboardMetricCard
                  title="Total Value"
                  value="$4.32M"
                  change="+8.7%"
                  trend="up"
                  icon={<FileText className="h-4 w-4" />}
                />
                <DashboardMetricCard
                  title="Avg. Contract Value"
                  value="$34,062"
                  change="+5.2%"
                  trend="up"
                  icon={<FileText className="h-4 w-4" />}
                />
                <DashboardMetricCard
                  title="Contracts Expiring"
                  value="14"
                  change="+2"
                  trend="up"
                  icon={<Calendar className="h-4 w-4" />}
                  trendDirection="negative"
                />
                <DashboardMetricCard
                  title="Renewal Opportunity"
                  value="$1.2M"
                  change="+12.5%"
                  trend="up"
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
                <DashboardMetricCard
                  title="Avg. Approval Time"
                  value="2.3 days"
                  change="-14.8%"
                  trend="down"
                  icon={<Calendar className="h-4 w-4" />}
                  trendDirection="positive"
                />
                <DashboardMetricCard
                  title="Avg. Negotiation Time"
                  value="5.7 days"
                  change="-8.1%"
                  trend="down"
                  icon={<Calendar className="h-4 w-4" />}
                  trendDirection="positive"
                />
                <DashboardMetricCard
                  title="Contracts per User"
                  value="12.4"
                  change="+3.2%"
                  trend="up"
                  icon={<FileText className="h-4 w-4" />}
                />
                <DashboardMetricCard
                  title="Automation Rate"
                  value="76%"
                  change="+12.5%"
                  trend="up"
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
                <DashboardMetricCard
                  title="High Risk Contracts"
                  value="12"
                  change="-2"
                  trend="down"
                  icon={<FileText className="h-4 w-4" />}
                  trendDirection="positive"
                />
                <DashboardMetricCard
                  title="Medium Risk Contracts"
                  value="34"
                  change="-5"
                  trend="down"
                  icon={<FileText className="h-4 w-4" />}
                  trendDirection="positive"
                />
                <DashboardMetricCard
                  title="Avg. Risk Score"
                  value="42/100"
                  change="-8.3%"
                  trend="down"
                  icon={<FileText className="h-4 w-4" />}
                  trendDirection="positive"
                />
                <DashboardMetricCard
                  title="Risk Reduction Rate"
                  value="18.5%"
                  change="+4.2%"
                  trend="up"
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
                <DashboardMetricCard
                  title="Compliance Score"
                  value="92%"
                  change="+3.5%"
                  trend="up"
                  icon={<FileText className="h-4 w-4" />}
                />
                <DashboardMetricCard
                  title="Non-compliant Contracts"
                  value="5"
                  change="-3"
                  trend="down"
                  icon={<FileText className="h-4 w-4" />}
                  trendDirection="positive"
                />
                <DashboardMetricCard
                  title="Compliance Issues"
                  value="12"
                  change="-8"
                  trend="down"
                  icon={<FileText className="h-4 w-4" />}
                  trendDirection="positive"
                />
                <DashboardMetricCard
                  title="Avg. Resolution Time"
                  value="3.2 days"
                  change="-12.5%"
                  trend="down"
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

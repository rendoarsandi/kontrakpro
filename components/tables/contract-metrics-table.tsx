"use client"

import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Sample data
const contractMetrics = [
  {
    type: "Service Agreement",
    count: 35,
    avgValue: 42500,
    avgProcessingTime: 4.2,
    renewalRate: 92,
    riskScore: 38,
  },
  {
    type: "NDA",
    count: 25,
    avgValue: 15000,
    avgProcessingTime: 2.1,
    renewalRate: 78,
    riskScore: 22,
  },
  {
    type: "Employment",
    count: 15,
    avgValue: 65000,
    avgProcessingTime: 5.8,
    renewalRate: 95,
    riskScore: 45,
  },
  {
    type: "Vendor",
    count: 12,
    avgValue: 78000,
    avgProcessingTime: 6.2,
    renewalRate: 85,
    riskScore: 52,
  },
  {
    type: "Lease",
    count: 8,
    avgValue: 120000,
    avgProcessingTime: 8.5,
    renewalRate: 90,
    riskScore: 48,
  },
  {
    type: "Other",
    count: 5,
    avgValue: 25000,
    avgProcessingTime: 3.8,
    renewalRate: 75,
    riskScore: 35,
  },
]

export function ContractMetricsTable() {
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value)
  }

  // Get risk level badge
  const getRiskBadge = (score: number) => {
    if (score < 30) {
      return (
        <Badge variant="outline" className="bg-green-100">
          Low
        </Badge>
      )
    }
    if (score < 50) {
      return (
        <Badge variant="outline" className="bg-yellow-100">
          Medium
        </Badge>
      )
    }
    return (
      <Badge variant="outline" className="bg-red-100">
        High
      </Badge>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Contract Type</TableHead>
            <TableHead className="text-right">Count</TableHead>
            <TableHead className="text-right">Avg. Value</TableHead>
            <TableHead className="text-right">Processing Time</TableHead>
            <TableHead className="text-right">Renewal Rate</TableHead>
            <TableHead className="text-right">Risk Level</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contractMetrics.map((metric) => (
            <TableRow key={metric.type}>
              <TableCell className="font-medium">{metric.type}</TableCell>
              <TableCell className="text-right">{metric.count}</TableCell>
              <TableCell className="text-right">{formatCurrency(metric.avgValue)}</TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <span>{metric.avgProcessingTime} days</span>
                  {metric.avgProcessingTime < 4 ? (
                    <ArrowDown className="h-4 w-4 text-green-500" />
                  ) : metric.avgProcessingTime > 6 ? (
                    <ArrowUp className="h-4 w-4 text-red-500" />
                  ) : (
                    <ArrowUpDown className="h-4 w-4 text-yellow-500" />
                  )}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex flex-col gap-1">
                  <span>{metric.renewalRate}%</span>
                  <Progress value={metric.renewalRate} className="h-1" />
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  {getRiskBadge(metric.riskScore)}
                  <span>{metric.riskScore}/100</span>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

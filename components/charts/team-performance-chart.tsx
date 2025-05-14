"use client"

import type React from "react"

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

import { Card } from "@/components/ui/card"

// Sample data
const data = [
  { team: "Legal", avgProcessingTime: 3.2, avgApprovalTime: 1.8, contractsProcessed: 42 },
  { team: "Sales", avgProcessingTime: 4.5, avgApprovalTime: 2.3, contractsProcessed: 35 },
  { team: "Procurement", avgProcessingTime: 5.1, avgApprovalTime: 2.7, contractsProcessed: 28 },
  { team: "HR", avgProcessingTime: 2.8, avgApprovalTime: 1.5, contractsProcessed: 22 },
  { team: "Finance", avgProcessingTime: 4.2, avgApprovalTime: 2.1, contractsProcessed: 18 },
]

interface TeamPerformanceChartProps extends React.HTMLAttributes<HTMLDivElement> {}

export function TeamPerformanceChart({ className, ...props }: TeamPerformanceChartProps) {
  return (
    <div className={className} {...props}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="team" />
          <YAxis yAxisId="left" orientation="left" label={{ value: "Days", angle: -90, position: "insideLeft" }} />
          <YAxis
            yAxisId="right"
            orientation="right"
            label={{ value: "Contracts", angle: 90, position: "insideRight" }}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <Card className="p-2 shadow-md">
                    <div className="font-medium">{label} Team</div>
                    {payload.map((entry, index) => (
                      <div key={`item-${index}`} className="flex items-center gap-2 text-sm">
                        <div className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
                        <span>
                          {entry.name}: {entry.value} {entry.name.includes("Time") ? "days" : "contracts"}
                        </span>
                      </div>
                    ))}
                  </Card>
                )
              }
              return null
            }}
          />
          <Legend />
          <Bar
            yAxisId="left"
            dataKey="avgProcessingTime"
            name="Avg. Processing Time"
            fill="#4f46e5"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            yAxisId="left"
            dataKey="avgApprovalTime"
            name="Avg. Approval Time"
            fill="#10b981"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            yAxisId="right"
            dataKey="contractsProcessed"
            name="Contracts Processed"
            fill="#f59e0b"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

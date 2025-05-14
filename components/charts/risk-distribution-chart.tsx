"use client"

import type React from "react"

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

import { Card } from "@/components/ui/card"

// Sample data
const data = [
  { name: "High Risk", value: 12, color: "#f43f5e" },
  { name: "Medium Risk", value: 34, color: "#f59e0b" },
  { name: "Low Risk", value: 81, color: "#10b981" },
]

interface RiskDistributionChartProps extends React.HTMLAttributes<HTMLDivElement> {}

export function RiskDistributionChart({ className, ...props }: RiskDistributionChartProps) {
  return (
    <div className={className} {...props}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={0}
            outerRadius="70%"
            paddingAngle={2}
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <Card className="p-2 shadow-md">
                    <div className="font-medium">{payload[0].name}</div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="h-2 w-2 rounded-full" style={{ backgroundColor: payload[0].payload.color }} />
                      <span>
                        {payload[0].value} contracts ({((payload[0].value / 127) * 100).toFixed(0)}%)
                      </span>
                    </div>
                  </Card>
                )
              }
              return null
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

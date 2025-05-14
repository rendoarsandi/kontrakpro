"use client"

import type React from "react"

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

import { Card } from "@/components/ui/card"

// Sample data
const data = [
  { name: "Service Agreement", value: 35, color: "#4f46e5" },
  { name: "NDA", value: 25, color: "#10b981" },
  { name: "Employment", value: 15, color: "#f43f5e" },
  { name: "Vendor", value: 12, color: "#f59e0b" },
  { name: "Lease", value: 8, color: "#6366f1" },
  { name: "Other", value: 5, color: "#8b5cf6" },
]

interface ContractTypeChartProps extends React.HTMLAttributes<HTMLDivElement> {}

export function ContractTypeChart({ className, ...props }: ContractTypeChartProps) {
  return (
    <div className={className} {...props}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius="40%"
            outerRadius="70%"
            paddingAngle={2}
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            labelLine={false}
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
                        {payload[0].value} contracts ({((payload[0].value / 100) * 100).toFixed(0)}%)
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

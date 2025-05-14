"use client"

import type React from "react"

import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

import { Card } from "@/components/ui/card"

// Sample data
const data = [
  { month: "Jan", value: 320000 },
  { month: "Feb", value: 450000 },
  { month: "Mar", value: 380000 },
  { month: "Apr", value: 520000 },
  { month: "May", value: 680000 },
  { month: "Jun", value: 540000 },
  { month: "Jul", value: 720000 },
  { month: "Aug", value: 620000 },
  { month: "Sep", value: 780000 },
  { month: "Oct", value: 680000 },
  { month: "Nov", value: 540000 },
  { month: "Dec", value: 480000 },
]

interface ContractValueChartProps extends React.HTMLAttributes<HTMLDivElement> {}

export function ContractValueChart({ className, ...props }: ContractValueChartProps) {
  const formatYAxis = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`
    }
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`
    }
    return `$${value}`
  }

  const formatTooltipValue = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className={className} {...props}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis tickFormatter={formatYAxis} />
          <Tooltip
            formatter={(value: number) => [formatTooltipValue(value), "Contract Value"]}
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <Card className="p-2 shadow-md">
                    <div className="font-medium">{label}</div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="h-2 w-2 rounded-full bg-indigo-600" />
                      <span>Value: {formatTooltipValue(payload[0].value as number)}</span>
                    </div>
                  </Card>
                )
              }
              return null
            }}
          />
          <Legend />
          <Area
            type="monotone"
            dataKey="value"
            name="Contract Value"
            stroke="#4f46e5"
            fillOpacity={1}
            fill="url(#colorValue)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

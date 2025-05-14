"use client"

import type React from "react"

import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

import { Card } from "@/components/ui/card"

// Sample data
const data = [
  { month: "Jan", riskScore: 58 },
  { month: "Feb", riskScore: 56 },
  { month: "Mar", riskScore: 54 },
  { month: "Apr", riskScore: 52 },
  { month: "May", riskScore: 50 },
  { month: "Jun", riskScore: 48 },
  { month: "Jul", riskScore: 46 },
  { month: "Aug", riskScore: 45 },
  { month: "Sep", riskScore: 44 },
  { month: "Oct", riskScore: 43 },
  { month: "Nov", riskScore: 42 },
  { month: "Dec", riskScore: 42 },
]

interface RiskTrendChartProps extends React.HTMLAttributes<HTMLDivElement> {}

export function RiskTrendChart({ className, ...props }: RiskTrendChartProps) {
  return (
    <div className={className} {...props}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <defs>
            <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis domain={[0, 100]} label={{ value: "Risk Score", angle: -90, position: "insideLeft" }} />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <Card className="p-2 shadow-md">
                    <div className="font-medium">{label}</div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="h-2 w-2 rounded-full bg-red-500" />
                      <span>Risk Score: {payload[0].value}/100</span>
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
            dataKey="riskScore"
            name="Risk Score"
            stroke="#f43f5e"
            fillOpacity={1}
            fill="url(#colorRisk)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

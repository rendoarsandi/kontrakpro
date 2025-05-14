"use client"

import type React from "react"

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

import { Card } from "@/components/ui/card"

// Sample data
const data = [
  { regulation: "GDPR", score: 94 },
  { regulation: "CCPA", score: 92 },
  { regulation: "HIPAA", score: 96 },
  { regulation: "SOX", score: 90 },
  { regulation: "PCI DSS", score: 88 },
  { regulation: "ISO 27001", score: 91 },
]

interface ComplianceScoreChartProps extends React.HTMLAttributes<HTMLDivElement> {}

export function ComplianceScoreChart({ className, ...props }: ComplianceScoreChartProps) {
  // Function to determine color based on score
  const getScoreColor = (score: number) => {
    if (score >= 95) return "#10b981" // Green for excellent
    if (score >= 90) return "#22c55e" // Light green for very good
    if (score >= 85) return "#f59e0b" // Yellow for good
    if (score >= 80) return "#f97316" // Orange for fair
    return "#f43f5e" // Red for poor
  }

  return (
    <div className={className} {...props}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="regulation" />
          <YAxis domain={[0, 100]} label={{ value: "Compliance Score (%)", angle: -90, position: "insideLeft" }} />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                const score = payload[0].value as number
                return (
                  <Card className="p-2 shadow-md">
                    <div className="font-medium">{label}</div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="h-2 w-2 rounded-full" style={{ backgroundColor: getScoreColor(score) }} />
                      <span>Compliance Score: {score}%</span>
                    </div>
                  </Card>
                )
              }
              return null
            }}
          />
          <Legend />
          <Bar
            dataKey="score"
            name="Compliance Score"
            radius={[4, 4, 0, 0]}
            fill="#10b981"
            // Use custom fill colors based on score
            cellRenderer={(props: any) => {
              const { x, y, width, height, value } = props
              return (
                <rect x={x} y={y} width={width} height={height} fill={getScoreColor(value)} radius={[4, 4, 0, 0]} />
              )
            }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import { Cell, Tooltip, XAxis, YAxis } from "recharts"
import { ResponsiveContainer, ScatterChart } from "recharts"

import { Card } from "@/components/ui/card"

// Generate sample data
const generateHeatmapData = () => {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
  const hours = Array.from({ length: 24 }, (_, i) => i)

  const data = []

  for (const day of days) {
    for (const hour of hours) {
      // Generate random value with higher values during business hours
      let value = Math.floor(Math.random() * 10)

      // Business hours (9-17) on weekdays have higher values
      if (hour >= 9 && hour <= 17 && day !== "Saturday" && day !== "Sunday") {
        value += Math.floor(Math.random() * 20) + 5
      }

      // Tuesday and Wednesday tend to be busier
      if ((day === "Tuesday" || day === "Wednesday") && hour >= 9 && hour <= 17) {
        value += Math.floor(Math.random() * 15)
      }

      data.push({
        day,
        hour,
        value,
      })
    }
  }

  return data
}

const heatmapData = generateHeatmapData()

// Color scale for heatmap
const getColor = (value: number) => {
  if (value <= 5) return "#f3f4f6" // Very light
  if (value <= 10) return "#dbeafe" // Light blue
  if (value <= 15) return "#93c5fd" // Medium blue
  if (value <= 25) return "#3b82f6" // Blue
  return "#1d4ed8" // Dark blue
}

interface ContractHeatmapProps extends React.HTMLAttributes<HTMLDivElement> {}

export function ContractHeatmap({ className, ...props }: ContractHeatmapProps) {
  const [activeCell, setActiveCell] = useState<{ day: string; hour: number; value: number } | null>(null)

  const formatHour = (hour: number) => {
    if (hour === 0) return "12 AM"
    if (hour === 12) return "12 PM"
    return hour < 12 ? `${hour} AM` : `${hour - 12} PM`
  }

  return (
    <div className={className} {...props}>
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 20, right: 40, bottom: 20, left: 40 }}>
          <XAxis
            type="category"
            dataKey="hour"
            name="Hour"
            allowDuplicatedCategory={false}
            tickFormatter={formatHour}
            ticks={[0, 3, 6, 9, 12, 15, 18, 21, 23]}
          />
          <YAxis type="category" dataKey="day" name="Day" allowDuplicatedCategory={false} width={80} />
          <Tooltip
            cursor={{ strokeDasharray: "3 3" }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload
                return (
                  <Card className="p-2 shadow-md">
                    <div className="font-medium">
                      {data.day}, {formatHour(data.hour)}
                    </div>
                    <div className="text-sm">
                      Activity: <span className="font-medium">{data.value} actions</span>
                    </div>
                  </Card>
                )
              }
              return null
            }}
          />
          {heatmapData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              width={20}
              height={20}
              x={entry.hour * 20 + 40}
              y={
                ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].indexOf(entry.day) * 20 +
                20
              }
              fill={getColor(entry.value)}
              onMouseOver={() => setActiveCell(entry)}
              onMouseOut={() => setActiveCell(null)}
              style={{ cursor: "pointer" }}
            />
          ))}
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  )
}

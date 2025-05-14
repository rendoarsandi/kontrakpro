"use client"

import type React from "react"

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

import { Card } from "@/components/ui/card"

// Sample data
const data = [
  { month: "Jan", created: 12, approved: 8, expired: 4 },
  { month: "Feb", created: 18, approved: 12, expired: 6 },
  { month: "Mar", created: 15, approved: 10, expired: 5 },
  { month: "Apr", created: 22, approved: 16, expired: 7 },
  { month: "May", created: 28, approved: 20, expired: 9 },
  { month: "Jun", created: 24, approved: 18, expired: 8 },
  { month: "Jul", created: 30, approved: 24, expired: 10 },
  { month: "Aug", created: 26, approved: 20, expired: 8 },
  { month: "Sep", created: 32, approved: 25, expired: 12 },
  { month: "Oct", created: 28, approved: 22, expired: 10 },
  { month: "Nov", created: 24, approved: 18, expired: 8 },
  { month: "Dec", created: 20, approved: 15, expired: 6 },
]

interface ContractActivityChartProps extends React.HTMLAttributes<HTMLDivElement> {}

export function ContractActivityChart({ className, ...props }: ContractActivityChartProps) {
  return (
    <div className={className} {...props}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <Card className="p-2 shadow-md">
                    <div className="font-medium">{label}</div>
                    {payload.map((entry, index) => (
                      <div key={`item-${index}`} className="flex items-center gap-2 text-sm">
                        <div className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
                        <span>
                          {entry.name}: {entry.value}
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
          <Bar dataKey="created" name="Created" fill="#4f46e5" radius={[4, 4, 0, 0]} />
          <Bar dataKey="approved" name="Approved" fill="#10b981" radius={[4, 4, 0, 0]} />
          <Bar dataKey="expired" name="Expired" fill="#f43f5e" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

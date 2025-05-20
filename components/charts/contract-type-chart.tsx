"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import { Card } from "@/components/ui/card"
import { LoadingIndicator } from "@/components/ui/loading-indicator"
import { api } from "@/lib/api"
import { ContractTypeData } from "@/lib/types/analytics"

// Fallback data
const fallbackData = [
  { name: "Service Agreement", value: 35, color: "#4f46e5" },
  { name: "NDA", value: 25, color: "#10b981" },
  { name: "Employment", value: 15, color: "#f43f5e" },
  { name: "Vendor", value: 12, color: "#f59e0b" },
  { name: "Lease", value: 8, color: "#6366f1" },
  { name: "Other", value: 5, color: "#8b5cf6" },
]

interface ContractTypeChartProps extends React.HTMLAttributes<HTMLDivElement> {}

export function ContractTypeChart({ className, ...props }: ContractTypeChartProps) {
  const [data, setData] = useState<ContractTypeData[]>(fallbackData)
  const [loading, setLoading] = useState(true)
  const [totalContracts, setTotalContracts] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await api.getSummaryMetrics()
        if (response.contract_types && response.contract_types.length > 0) {
          setData(response.contract_types)
          // Hitung total kontrak
          const total = response.contract_types.reduce((sum, item) => sum + item.value, 0)
          setTotalContracts(total)
        }
      } catch (error) {
        console.error("Error fetching contract type data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className={className} {...props}>
      {loading ? (
        <div className="flex h-full items-center justify-center">
          <LoadingIndicator text="Memuat data..." />
        </div>
      ) : (
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
                  const value = payload[0].value as number
                  const total = totalContracts || data.reduce((sum, item) => sum + item.value, 0)
                  const percent = ((value / total) * 100).toFixed(0)

                  return (
                    <Card className="p-2 shadow-md">
                      <div className="font-medium">{payload[0].name}</div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="h-2 w-2 rounded-full" style={{ backgroundColor: payload[0].payload.color }} />
                        <span>
                          {value} kontrak ({percent}%)
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
      )}
    </div>
  )
}

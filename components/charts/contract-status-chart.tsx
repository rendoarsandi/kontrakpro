"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import { Card } from "@/components/ui/card"
import { LoadingIndicator } from "@/components/ui/loading-indicator"
import { api } from "@/lib/api"
import { ContractStatusData } from "@/lib/types/analytics"

// Fallback data
const fallbackData = [
  { name: "Active", value: 86, color: "#10b981" },
  { name: "Draft", value: 18, color: "#6366f1" },
  { name: "Pending Approval", value: 12, color: "#f59e0b" },
  { name: "Expired", value: 8, color: "#f43f5e" },
  { name: "Terminated", value: 3, color: "#64748b" },
]

interface ContractStatusChartProps extends React.HTMLAttributes<HTMLDivElement> {}

export function ContractStatusChart({ className, ...props }: ContractStatusChartProps) {
  const [data, setData] = useState<ContractStatusData[]>(fallbackData)
  const [loading, setLoading] = useState(true)
  const [totalContracts, setTotalContracts] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await api.getSummaryMetrics()
        if (response.contract_status && response.contract_status.length > 0) {
          setData(response.contract_status)
          // Hitung total kontrak
          const total = response.contract_status.reduce((sum, item) => sum + item.value, 0)
          setTotalContracts(total)
        }
      } catch (error) {
        console.error("Error fetching contract status data:", error)
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
                  const value = payload[0].value as number
                  const total = totalContracts || data.reduce((sum, item) => sum + item.value, 0)
                  const percent = ((value / total) * 100).toFixed(0)

                  return (
                    <Card className="p-2 shadow-md">
                      <div className="font-medium">{payload[0].name}</div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="h-2 w-2 rounded-full" style={{ backgroundColor: payload[0].payload.color }} />
                        <span>
                          {value} contracts ({percent}%)
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

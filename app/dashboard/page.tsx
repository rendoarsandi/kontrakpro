"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Bell, Calendar, ChevronDown, Clock, FileText, Filter, Plus, Search, Shield } from "lucide-react"
// import { supabase } from "@/lib/supabaseClient"; // Supabase removed

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"; // Import cn utility

export default function DashboardPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  // Static data since Supabase is removed
  const userName = "Demo User";
  const totalContracts = 125;
  const totalContractsTrend = "+5 this month";
  const pendingApproval = 8;
  const pendingApprovalSubtext = "2 new since yesterday";
  const dueThisWeek = 3;
  const dueThisWeekSubtext = "1 critical";
  const riskScore = 75; // Example risk score
  const [isLoading, setIsLoading] = useState(false); // No longer loading from Supabase initially

  // useEffect for fetching data and auth state is removed as Supabase is not used.
  // If you have an alternative auth system, integrate its logic here.
  // For now, we assume the user is "logged in" for display purposes.

  const getRiskBadgeVariant = (score: number | null): "default" | "destructive" | "outline" | "secondary" => {
    if (score === null) return "outline";
    if (score >= 80) return "default";
    if (score >= 60) return "secondary";
    return "destructive";
  };
  
  const riskScoreLabel = riskScore === null ? "Loading..." : riskScore >= 80 ? "Low Risk" : riskScore >= 60 ? "Medium Risk" : "High Risk";

  return (
    <div className="flex flex-col bg-slate-50 dark:bg-slate-950 min-h-screen">
      {/* Header is part of the layout, assuming it's handled in app/dashboard/layout.tsx */}
      {/* For this page, we'll focus on the main content area */}
      <main className="flex-1 p-6 md:p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Welcome back, {userName || "Loading..."}!</h1>
          <p className="text-slate-600 dark:text-slate-400">Here's what's happening with your contracts today.</p>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 dark:bg-slate-800/70">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">Total Contracts</CardTitle>
              <FileText className="h-5 w-5 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900 dark:text-slate-50">{isLoading ? "..." : totalContracts}</div>
              {totalContractsTrend && !isLoading && <p className="text-xs text-slate-500 dark:text-slate-400">{totalContractsTrend}</p>}
            </CardContent>
          </Card>
          <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 dark:bg-slate-800/70">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">Pending Approval</CardTitle>
              <Clock className="h-5 w-5 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900 dark:text-slate-50">{isLoading ? "..." : pendingApproval}</div>
              {pendingApprovalSubtext && !isLoading && <p className="text-xs text-slate-500 dark:text-slate-400">{pendingApprovalSubtext}</p>}
            </CardContent>
          </Card>
          <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 dark:bg-slate-800/70">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">Due This Week</CardTitle>
              <Calendar className="h-5 w-5 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900 dark:text-slate-50">{isLoading ? "..." : dueThisWeek}</div>
              {dueThisWeekSubtext && !isLoading && <p className="text-xs text-slate-500 dark:text-slate-400">{dueThisWeekSubtext}</p>}
            </CardContent>
          </Card>
          <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 dark:bg-slate-800/70">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">Risk Score</CardTitle>
              <Shield className="h-5 w-5 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <div className="text-3xl font-bold text-slate-900 dark:text-slate-50">{isLoading ? "..." : riskScore}%</div>
                {!isLoading && riskScore !== null && (
                  <Badge 
                    variant={getRiskBadgeVariant(riskScore)} 
                    className={cn("text-xs", {
                      "bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-300": riskScore >= 80,
                      "bg-yellow-100 text-yellow-800 dark:bg-yellow-800/30 dark:text-yellow-300": riskScore >= 60 && riskScore < 80,
                      "bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-300": riskScore < 60,
                    })}
                  >
                    {riskScoreLabel}
                  </Badge>
                )}
              </div>
              {!isLoading && riskScore !== null && (
                <Progress 
                  value={riskScore} 
                  className={cn("mt-2 h-2", {
                    "[&>div]:bg-green-500": riskScore >= 80,
                    "[&>div]:bg-yellow-500": riskScore >= 60 && riskScore < 80,
                    "[&>div]:bg-red-500": riskScore < 60,
                  })} 
                />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <TabsList className="bg-slate-200 dark:bg-slate-800 p-1 rounded-lg">
              <TabsTrigger value="overview" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-sm">Overview</TabsTrigger>
              <TabsTrigger value="recent" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-sm">Recent Contracts</TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-sm">Analytics</TabsTrigger>
            </TabsList>
            <Button onClick={() => router.push('/dashboard/create')} className="shadow-md hover:shadow-lg transition-shadow">
              <Plus className="mr-2 h-4 w-4" /> New Contract
            </Button>
          </div>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
              {/* Recent Activity */}
              <Card className="col-span-full lg:col-span-4 shadow-md dark:bg-slate-800/70">
                <CardHeader>
                  <CardTitle className="text-slate-800 dark:text-slate-100">Recent Activity</CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-400">Your contract activity from the past 7 days</CardDescription>
                </CardHeader>
                <CardContent className="min-h-[250px] sm:min-h-[300px] overflow-auto text-slate-500 dark:text-slate-400">
                  {/* TODO: Add ContractActivityChart component here */}
                  <p>Contract Activity Chart Placeholder</p>
                </CardContent>
              </Card>

              {/* Contract Types */}
              <Card className="col-span-full lg:col-span-3 shadow-md dark:bg-slate-800/70">
                <CardHeader>
                  <CardTitle className="text-slate-800 dark:text-slate-100">Contract Types</CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-400">Distribution by category</CardDescription>
                </CardHeader>
                <CardContent className="min-h-[250px] sm:min-h-[300px] overflow-auto text-slate-500 dark:text-slate-400">
                  {/* TODO: Add ContractTypeChart component here */}
                  <p>Contract Type Chart Placeholder</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="recent" className="space-y-6">
            <Card className="shadow-md dark:bg-slate-800/70">
              <CardHeader>
                <CardTitle className="text-slate-800 dark:text-slate-100">Recently Accessed Contracts</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">A list of your most recently viewed or modified contracts.</CardDescription>
              </CardHeader>
              <CardContent className="min-h-[250px] sm:min-h-[300px] overflow-auto text-slate-500 dark:text-slate-400">
                {/* TODO: Add recent contracts table component here */}
                <p>Recent Contracts Table Placeholder</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
             <Card className="shadow-md dark:bg-slate-800/70">
              <CardHeader>
                <CardTitle className="text-slate-800 dark:text-slate-100">Performance Analytics</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">Key performance indicators and trends.</CardDescription>
              </CardHeader>
              <CardContent className="min-h-[250px] sm:min-h-[300px] overflow-auto text-slate-500 dark:text-slate-400">
                {/* TODO: Add analytics components here */}
                <p>Analytics Dashboard Placeholder</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
// Note: The header part with Search and Bell icon was removed as it's likely part of a shared layout.
// If it's specific to this page and needs to be retained, it should be added back.
// Also, the cn utility needs to be imported: import { cn } from "@/lib/utils";

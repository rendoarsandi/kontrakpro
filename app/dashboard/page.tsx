"use client"

import { useState } from "react"
import { Bell, Calendar, ChevronDown, Clock, FileText, Filter, Plus, Search } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search contracts..."
              className="w-full pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="ml-auto flex items-center gap-4">
            <Button variant="outline" size="icon" className="relative">
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                3
              </span>
              <span className="sr-only">Notifications</span>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
            <Button className="gap-1">
              <Plus className="h-4 w-4" />
              New Contract
            </Button>
          </div>
          <Tabs defaultValue="overview" className="mt-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="contracts">Contracts</TabsTrigger>
              <TabsTrigger value="approvals">Approvals</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Contracts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">127</div>
                    <p className="text-xs text-muted-foreground">+5 this month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">12</div>
                    <p className="text-xs text-muted-foreground">3 urgent</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">8</div>
                    <p className="text-xs text-muted-foreground">Within 30 days</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Completed This Month</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">24</div>
                    <p className="text-xs text-muted-foreground">+15% from last month</p>
                  </CardContent>
                </Card>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="lg:col-span-4">
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        {
                          title: "Service Agreement - Acme Inc",
                          status: "Pending Approval",
                          time: "2 hours ago",
                          user: "Sarah Johnson",
                        },
                        {
                          title: "NDA - XYZ Corp",
                          status: "Approved",
                          time: "Yesterday",
                          user: "Michael Chen",
                        },
                        {
                          title: "Employment Contract - Jane Smith",
                          status: "Signed",
                          time: "2 days ago",
                          user: "You",
                        },
                        {
                          title: "Software License - TechCorp",
                          status: "Rejected",
                          time: "3 days ago",
                          user: "Legal Team",
                        },
                        {
                          title: "Vendor Agreement - Supplier Inc",
                          status: "Draft",
                          time: "1 week ago",
                          user: "You",
                        },
                      ].map((activity, i) => (
                        <div key={i} className="flex items-center gap-4">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                            <FileText className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1 space-y-1">
                            <p className="text-sm font-medium leading-none">{activity.title}</p>
                            <p className="text-sm text-muted-foreground">
                              <span className="font-medium">{activity.user}</span> - {activity.status}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {activity.time}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                <Card className="lg:col-span-3">
                  <CardHeader>
                    <CardTitle>Upcoming Deadlines</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        {
                          title: "Vendor Agreement Renewal",
                          date: "May 20, 2025",
                          days: 6,
                          priority: "high",
                        },
                        {
                          title: "Client Contract Review",
                          date: "May 25, 2025",
                          days: 11,
                          priority: "medium",
                        },
                        {
                          title: "Partnership Agreement",
                          date: "June 2, 2025",
                          days: 19,
                          priority: "medium",
                        },
                        {
                          title: "Office Lease Renewal",
                          date: "June 15, 2025",
                          days: 32,
                          priority: "low",
                        },
                      ].map((deadline, i) => (
                        <div key={i} className="flex items-center gap-4">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                            <Calendar className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div className="flex-1 space-y-1">
                            <p className="text-sm font-medium leading-none">{deadline.title}</p>
                            <p className="text-sm text-muted-foreground">{deadline.date}</p>
                          </div>
                          <Badge
                            variant={
                              deadline.priority === "high"
                                ? "destructive"
                                : deadline.priority === "medium"
                                  ? "default"
                                  : "outline"
                            }
                          >
                            {deadline.days} days
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="contracts" className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="h-8 gap-1">
                    <Filter className="h-3.5 w-3.5" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm" className="h-8">
                    Status: All
                    <ChevronDown className="ml-2 h-3.5 w-3.5" />
                  </Button>
                </div>
                <Button size="sm" className="h-8 gap-1">
                  <Plus className="h-3.5 w-3.5" />
                  New Contract
                </Button>
              </div>
              <div className="rounded-md border">
                <div className="relative w-full overflow-auto">
                  <table className="w-full caption-bottom text-sm">
                    <thead>
                      <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <th className="h-12 px-4 text-left align-middle font-medium">Name</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Type</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Created</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Expiry</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Owner</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        {
                          name: "Service Agreement - Acme Inc",
                          status: "Pending Approval",
                          type: "Service Agreement",
                          created: "May 10, 2025",
                          expiry: "May 10, 2026",
                          owner: "Sarah Johnson",
                        },
                        {
                          name: "NDA - XYZ Corp",
                          status: "Active",
                          type: "NDA",
                          created: "Apr 15, 2025",
                          expiry: "Apr 15, 2027",
                          owner: "Michael Chen",
                        },
                        {
                          name: "Employment Contract - Jane Smith",
                          status: "Active",
                          type: "Employment",
                          created: "Mar 22, 2025",
                          expiry: "Indefinite",
                          owner: "HR Department",
                        },
                        {
                          name: "Software License - TechCorp",
                          status: "Draft",
                          type: "License",
                          created: "May 5, 2025",
                          expiry: "N/A",
                          owner: "You",
                        },
                        {
                          name: "Vendor Agreement - Supplier Inc",
                          status: "Expired",
                          type: "Vendor",
                          created: "Jan 10, 2024",
                          expiry: "Jan 10, 2025",
                          owner: "Procurement",
                        },
                      ].map((contract, i) => (
                        <tr
                          key={i}
                          className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                        >
                          <td className="p-4 align-middle font-medium">{contract.name}</td>
                          <td className="p-4 align-middle">
                            <Badge
                              variant={
                                contract.status === "Active"
                                  ? "outline"
                                  : contract.status === "Pending Approval"
                                    ? "default"
                                    : contract.status === "Draft"
                                      ? "secondary"
                                      : "destructive"
                              }
                            >
                              {contract.status}
                            </Badge>
                          </td>
                          <td className="p-4 align-middle">{contract.type}</td>
                          <td className="p-4 align-middle">{contract.created}</td>
                          <td className="p-4 align-middle">{contract.expiry}</td>
                          <td className="p-4 align-middle">{contract.owner}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="approvals" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Pending Approvals</CardTitle>
                  <CardDescription>Contracts waiting for your review and approval</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        name: "Service Agreement - Acme Inc",
                        requestedBy: "Sarah Johnson",
                        date: "May 12, 2025",
                        urgent: true,
                      },
                      {
                        name: "Partnership Agreement - Global Partners",
                        requestedBy: "Robert Lee",
                        date: "May 11, 2025",
                        urgent: false,
                      },
                      {
                        name: "Software License Amendment - TechCorp",
                        requestedBy: "IT Department",
                        date: "May 10, 2025",
                        urgent: true,
                      },
                      {
                        name: "Consulting Agreement - Experts Ltd",
                        requestedBy: "David Wilson",
                        date: "May 8, 2025",
                        urgent: false,
                      },
                      {
                        name: "Equipment Purchase - Supplier Co",
                        requestedBy: "Procurement",
                        date: "May 5, 2025",
                        urgent: false,
                      },
                    ].map((approval, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{approval.name}</span>
                            {approval.urgent && (
                              <Badge variant="destructive" className="h-5 text-xs">
                                Urgent
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Requested by {approval.requestedBy} on {approval.date}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                          <Button size="sm">Approve</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Recently Approved</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        name: "NDA - XYZ Corp",
                        approvedBy: "You",
                        date: "May 9, 2025",
                      },
                      {
                        name: "Employment Contract - Jane Smith",
                        approvedBy: "HR Director",
                        date: "May 7, 2025",
                      },
                      {
                        name: "Office Supplies Order - Office Depot",
                        approvedBy: "You",
                        date: "May 3, 2025",
                      },
                    ].map((approval, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <div className="flex-1">
                          <div className="font-medium">{approval.name}</div>
                          <div className="text-sm text-muted-foreground">
                            Approved by {approval.approvedBy} on {approval.date}
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="analytics" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Contract Types</CardTitle>
                  </CardHeader>
                  <CardContent className="flex aspect-square items-center justify-center">
                    <div className="flex h-full w-full flex-col items-center justify-center rounded-md border-2 border-dashed p-10 text-center">
                      <div className="text-3xl font-bold">Pie Chart</div>
                      <div className="text-sm text-muted-foreground">Distribution of contract types</div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Contract Status</CardTitle>
                  </CardHeader>
                  <CardContent className="flex aspect-square items-center justify-center">
                    <div className="flex h-full w-full flex-col items-center justify-center rounded-md border-2 border-dashed p-10 text-center">
                      <div className="text-3xl font-bold">Bar Chart</div>
                      <div className="text-sm text-muted-foreground">Contracts by status</div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="md:col-span-2 lg:col-span-1">
                  <CardHeader>
                    <CardTitle>Processing Time</CardTitle>
                  </CardHeader>
                  <CardContent className="flex aspect-square items-center justify-center">
                    <div className="flex h-full w-full flex-col items-center justify-center rounded-md border-2 border-dashed p-10 text-center">
                      <div className="text-3xl font-bold">Line Chart</div>
                      <div className="text-sm text-muted-foreground">Average time to process contracts</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Contract Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium">Approval Efficiency</div>
                        <div className="text-sm text-muted-foreground">75%</div>
                      </div>
                      <Progress value={75} className="h-2 mt-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium">Contract Completion Rate</div>
                        <div className="text-sm text-muted-foreground">92%</div>
                      </div>
                      <Progress value={92} className="h-2 mt-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium">Template Usage</div>
                        <div className="text-sm text-muted-foreground">68%</div>
                      </div>
                      <Progress value={68} className="h-2 mt-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium">On-time Renewals</div>
                        <div className="text-sm text-muted-foreground">88%</div>
                      </div>
                      <Progress value={88} className="h-2 mt-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

"use client"

import { useState } from "react"
import { format } from "date-fns"
import { CalendarIcon, Download, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { AuditEventDetails } from "@/components/audit/audit-event-details"
import { AuditEventTypeIcon } from "@/components/audit/audit-event-type-icon"
import { cn } from "@/lib/utils"

// Mock data for audit events
const auditEvents = [
  {
    id: "audit-1",
    eventType: "contract_created",
    contractId: "contract-123",
    contractName: "Service Agreement with Acme Corp",
    timestamp: new Date(2025, 4, 14, 9, 30),
    user: {
      id: "user-1",
      name: "John Doe",
      email: "john.doe@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    details: {
      contractType: "Service Agreement",
      value: "$50,000",
      parties: ["Acme Corp", "Our Company"],
    },
    ipAddress: "192.168.1.1",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
  },
  {
    id: "audit-2",
    eventType: "contract_updated",
    contractId: "contract-123",
    contractName: "Service Agreement with Acme Corp",
    timestamp: new Date(2025, 4, 14, 10, 15),
    user: {
      id: "user-2",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    details: {
      changes: [
        { field: "value", from: "$50,000", to: "$55,000" },
        { field: "endDate", from: "2025-12-31", to: "2026-06-30" },
      ],
    },
    ipAddress: "192.168.1.2",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
  },
  {
    id: "audit-3",
    eventType: "contract_shared",
    contractId: "contract-123",
    contractName: "Service Agreement with Acme Corp",
    timestamp: new Date(2025, 4, 14, 11, 45),
    user: {
      id: "user-1",
      name: "John Doe",
      email: "john.doe@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    details: {
      sharedWith: [
        { name: "Legal Team", type: "group" },
        { name: "robert.johnson@example.com", type: "external" },
      ],
      permissions: "view",
    },
    ipAddress: "192.168.1.1",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
  },
  {
    id: "audit-4",
    eventType: "contract_signed",
    contractId: "contract-123",
    contractName: "Service Agreement with Acme Corp",
    timestamp: new Date(2025, 4, 14, 14, 20),
    user: {
      id: "user-3",
      name: "Robert Johnson",
      email: "robert.johnson@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    details: {
      signatureType: "electronic",
      signatureMethod: "draw",
      signaturePosition: "page 12, section 8.3",
    },
    ipAddress: "203.0.113.45",
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)",
  },
  {
    id: "audit-5",
    eventType: "contract_approved",
    contractId: "contract-123",
    contractName: "Service Agreement with Acme Corp",
    timestamp: new Date(2025, 4, 14, 16, 10),
    user: {
      id: "user-4",
      name: "Sarah Williams",
      email: "sarah.williams@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    details: {
      approvalLevel: "executive",
      comments: "Approved after legal review",
    },
    ipAddress: "192.168.1.5",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
  },
  {
    id: "audit-6",
    eventType: "contract_viewed",
    contractId: "contract-123",
    contractName: "Service Agreement with Acme Corp",
    timestamp: new Date(2025, 4, 14, 17, 30),
    user: {
      id: "user-5",
      name: "Michael Brown",
      email: "michael.brown@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    details: {
      viewDuration: "5 minutes",
      pagesViewed: [1, 2, 5, 12],
    },
    ipAddress: "192.168.1.10",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
  },
  {
    id: "audit-7",
    eventType: "ai_analysis_performed",
    contractId: "contract-123",
    contractName: "Service Agreement with Acme Corp",
    timestamp: new Date(2025, 4, 15, 9, 0),
    user: {
      id: "user-1",
      name: "John Doe",
      email: "john.doe@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    details: {
      analysisType: "comprehensive",
      riskScore: 72,
      issuesIdentified: 3,
      missingClauses: 1,
    },
    ipAddress: "192.168.1.1",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
  },
  {
    id: "audit-8",
    eventType: "contract_exported",
    contractId: "contract-123",
    contractName: "Service Agreement with Acme Corp",
    timestamp: new Date(2025, 4, 15, 10, 30),
    user: {
      id: "user-2",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    details: {
      exportFormat: "PDF",
      includesAttachments: true,
      includesSignatures: true,
    },
    ipAddress: "192.168.1.2",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
  },
  {
    id: "audit-9",
    eventType: "contract_archived",
    contractId: "contract-123",
    contractName: "Service Agreement with Acme Corp",
    timestamp: new Date(2025, 4, 15, 14, 45),
    user: {
      id: "user-4",
      name: "Sarah Williams",
      email: "sarah.williams@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    details: {
      reason: "Contract completed",
      retentionPeriod: "7 years",
    },
    ipAddress: "192.168.1.5",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
  },
  {
    id: "audit-10",
    eventType: "permission_changed",
    contractId: "contract-123",
    contractName: "Service Agreement with Acme Corp",
    timestamp: new Date(2025, 4, 15, 16, 20),
    user: {
      id: "user-1",
      name: "John Doe",
      email: "john.doe@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    details: {
      userAffected: "Legal Team",
      permissionChanges: [
        { permission: "edit", from: true, to: false },
        { permission: "share", from: true, to: false },
      ],
    },
    ipAddress: "192.168.1.1",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
  },
]

// Event type mapping for display
const eventTypeMap = {
  contract_created: { label: "Kontrak Dibuat", color: "bg-green-100 text-green-800" },
  contract_updated: { label: "Kontrak Diperbarui", color: "bg-blue-100 text-blue-800" },
  contract_shared: { label: "Kontrak Dibagikan", color: "bg-purple-100 text-purple-800" },
  contract_signed: { label: "Kontrak Ditandatangani", color: "bg-emerald-100 text-emerald-800" },
  contract_approved: { label: "Kontrak Disetujui", color: "bg-teal-100 text-teal-800" },
  contract_viewed: { label: "Kontrak Dilihat", color: "bg-gray-100 text-gray-800" },
  ai_analysis_performed: { label: "Analisis AI Dilakukan", color: "bg-indigo-100 text-indigo-800" },
  contract_exported: { label: "Kontrak Diekspor", color: "bg-amber-100 text-amber-800" },
  contract_archived: { label: "Kontrak Diarsipkan", color: "bg-orange-100 text-orange-800" },
  permission_changed: { label: "Izin Diubah", color: "bg-rose-100 text-rose-800" },
}

export default function AuditTrailPage() {
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedEventType, setSelectedEventType] = useState<string>("all")
  const [selectedUser, setSelectedUser] = useState<string>("all")
  const [selectedContract, setSelectedContract] = useState<string>("all")
  const [selectedTab, setSelectedTab] = useState("all")

  // Filter events based on search, date, event type, user, and contract
  const filteredEvents = auditEvents.filter((event) => {
    // Filter by search query
    const searchLower = searchQuery.toLowerCase()
    const matchesSearch =
      event.contractName.toLowerCase().includes(searchLower) ||
      event.user.name.toLowerCase().includes(searchLower) ||
      event.user.email.toLowerCase().includes(searchLower) ||
      eventTypeMap[event.eventType as keyof typeof eventTypeMap].label.toLowerCase().includes(searchLower)

    // Filter by date
    const matchesDate =
      !date ||
      (event.timestamp.getDate() === date.getDate() &&
        event.timestamp.getMonth() === date.getMonth() &&
        event.timestamp.getFullYear() === date.getFullYear())

    // Filter by event type
    const matchesEventType = selectedEventType === "all" || event.eventType === selectedEventType

    // Filter by user
    const matchesUser = selectedUser === "all" || event.user.id === selectedUser

    // Filter by contract
    const matchesContract = selectedContract === "all" || event.contractId === selectedContract

    // Filter by tab (time period)
    const now = new Date()
    const isToday =
      event.timestamp.getDate() === now.getDate() &&
      event.timestamp.getMonth() === now.getMonth() &&
      event.timestamp.getFullYear() === now.getFullYear()

    const isThisWeek = now.getTime() - event.timestamp.getTime() < 7 * 24 * 60 * 60 * 1000

    const isThisMonth =
      event.timestamp.getMonth() === now.getMonth() && event.timestamp.getFullYear() === now.getFullYear()

    const matchesTab =
      selectedTab === "all" ||
      (selectedTab === "today" && isToday) ||
      (selectedTab === "week" && isThisWeek) ||
      (selectedTab === "month" && isThisMonth)

    return matchesSearch && matchesDate && matchesEventType && matchesUser && matchesContract && matchesTab
  })

  // Get unique users for filter
  const uniqueUsers = Array.from(new Set(auditEvents.map((event) => event.user.id))).map((userId) => {
    const user = auditEvents.find((event) => event.user.id === userId)?.user
    return { id: userId, name: user?.name, email: user?.email }
  })

  // Get unique contracts for filter
  const uniqueContracts = Array.from(new Set(auditEvents.map((event) => event.contractId))).map((contractId) => {
    const contract = auditEvents.find((event) => event.contractId === contractId)
    return { id: contractId, name: contract?.contractName }
  })

  // Function to export audit trail as CSV
  const exportAuditTrail = () => {
    const headers = ["Tanggal", "Waktu", "Jenis Aktivitas", "Pengguna", "Email", "Kontrak", "Detail", "IP Address"]

    const csvData = filteredEvents.map((event) => [
      format(event.timestamp, "dd/MM/yyyy"),
      format(event.timestamp, "HH:mm"),
      eventTypeMap[event.eventType as keyof typeof eventTypeMap].label,
      event.user.name,
      event.user.email,
      event.contractName,
      JSON.stringify(event.details),
      event.ipAddress,
    ])

    const csvContent = [headers.join(","), ...csvData.map((row) => row.join(","))].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `audit-trail-${format(new Date(), "yyyy-MM-dd")}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Jejak Audit</h1>
          <p className="text-muted-foreground">Pantau semua aktivitas yang terjadi pada kontrak Anda</p>
        </div>
        <Button onClick={exportAuditTrail} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          <span>Ekspor CSV</span>
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Filter dan Pencarian</CardTitle>
          <CardDescription>Gunakan filter untuk menemukan aktivitas spesifik</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Cari aktivitas..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("justify-start text-left font-normal w-full", !date && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Pilih tanggal"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
              </PopoverContent>
            </Popover>

            <Select value={selectedEventType} onValueChange={setSelectedEventType}>
              <SelectTrigger>
                <SelectValue placeholder="Jenis Aktivitas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Jenis</SelectItem>
                {Object.entries(eventTypeMap).map(([key, { label }]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedUser} onValueChange={setSelectedUser}>
              <SelectTrigger>
                <SelectValue placeholder="Pengguna" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Pengguna</SelectItem>
                {uniqueUsers.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedContract} onValueChange={setSelectedContract}>
              <SelectTrigger>
                <SelectValue placeholder="Kontrak" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kontrak</SelectItem>
                {uniqueContracts.map((contract) => (
                  <SelectItem key={contract.id} value={contract.id}>
                    {contract.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all" value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="all">Semua Waktu</TabsTrigger>
          <TabsTrigger value="today">Hari Ini</TabsTrigger>
          <TabsTrigger value="week">Minggu Ini</TabsTrigger>
          <TabsTrigger value="month">Bulan Ini</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-6">
          <Card>
            <CardContent className="p-0">
              <div className="rounded-md border">
                <div className="relative w-full overflow-auto">
                  <table className="w-full caption-bottom text-sm">
                    <thead>
                      <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <th className="h-12 px-4 text-left align-middle font-medium">Waktu</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Aktivitas</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Pengguna</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Kontrak</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Detail</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEvents.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="h-24 text-center text-muted-foreground">
                            Tidak ada data audit yang ditemukan
                          </td>
                        </tr>
                      ) : (
                        filteredEvents.map((event) => (
                          <tr
                            key={event.id}
                            className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                          >
                            <td className="p-4 align-middle">
                              <div className="font-medium">{format(event.timestamp, "dd MMM yyyy")}</div>
                              <div className="text-xs text-muted-foreground">{format(event.timestamp, "HH:mm")}</div>
                            </td>
                            <td className="p-4 align-middle">
                              <div className="flex items-center gap-2">
                                <AuditEventTypeIcon eventType={event.eventType} />
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    "font-medium",
                                    eventTypeMap[event.eventType as keyof typeof eventTypeMap]?.color,
                                  )}
                                >
                                  {eventTypeMap[event.eventType as keyof typeof eventTypeMap]?.label}
                                </Badge>
                              </div>
                            </td>
                            <td className="p-4 align-middle">
                              <div className="flex items-center gap-2">
                                <img
                                  src={event.user.avatar || "/placeholder.svg"}
                                  alt={event.user.name}
                                  className="h-6 w-6 rounded-full"
                                />
                                <div>
                                  <div className="font-medium">{event.user.name}</div>
                                  <div className="text-xs text-muted-foreground">{event.user.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="p-4 align-middle">
                              <div className="font-medium">{event.contractName}</div>
                            </td>
                            <td className="p-4 align-middle">
                              <AuditEventDetails event={event} />
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="today" className="mt-6">
          <Card>
            <CardContent className="p-0">
              {/* Same table structure as "all" tab */}
              <div className="rounded-md border">
                <div className="relative w-full overflow-auto">
                  <table className="w-full caption-bottom text-sm">
                    <thead>
                      <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <th className="h-12 px-4 text-left align-middle font-medium">Waktu</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Aktivitas</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Pengguna</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Kontrak</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Detail</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEvents.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="h-24 text-center text-muted-foreground">
                            Tidak ada data audit yang ditemukan untuk hari ini
                          </td>
                        </tr>
                      ) : (
                        filteredEvents.map((event) => (
                          <tr
                            key={event.id}
                            className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                          >
                            <td className="p-4 align-middle">
                              <div className="font-medium">{format(event.timestamp, "dd MMM yyyy")}</div>
                              <div className="text-xs text-muted-foreground">{format(event.timestamp, "HH:mm")}</div>
                            </td>
                            <td className="p-4 align-middle">
                              <div className="flex items-center gap-2">
                                <AuditEventTypeIcon eventType={event.eventType} />
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    "font-medium",
                                    eventTypeMap[event.eventType as keyof typeof eventTypeMap]?.color,
                                  )}
                                >
                                  {eventTypeMap[event.eventType as keyof typeof eventTypeMap]?.label}
                                </Badge>
                              </div>
                            </td>
                            <td className="p-4 align-middle">
                              <div className="flex items-center gap-2">
                                <img
                                  src={event.user.avatar || "/placeholder.svg"}
                                  alt={event.user.name}
                                  className="h-6 w-6 rounded-full"
                                />
                                <div>
                                  <div className="font-medium">{event.user.name}</div>
                                  <div className="text-xs text-muted-foreground">{event.user.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="p-4 align-middle">
                              <div className="font-medium">{event.contractName}</div>
                            </td>
                            <td className="p-4 align-middle">
                              <AuditEventDetails event={event} />
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="week" className="mt-6">
          {/* Same structure as other tabs */}
          <Card>
            <CardContent className="p-0">
              <div className="rounded-md border">
                <div className="relative w-full overflow-auto">
                  <table className="w-full caption-bottom text-sm">
                    <thead>
                      <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <th className="h-12 px-4 text-left align-middle font-medium">Waktu</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Aktivitas</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Pengguna</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Kontrak</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Detail</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEvents.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="h-24 text-center text-muted-foreground">
                            Tidak ada data audit yang ditemukan untuk minggu ini
                          </td>
                        </tr>
                      ) : (
                        filteredEvents.map((event) => (
                          <tr
                            key={event.id}
                            className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                          >
                            <td className="p-4 align-middle">
                              <div className="font-medium">{format(event.timestamp, "dd MMM yyyy")}</div>
                              <div className="text-xs text-muted-foreground">{format(event.timestamp, "HH:mm")}</div>
                            </td>
                            <td className="p-4 align-middle">
                              <div className="flex items-center gap-2">
                                <AuditEventTypeIcon eventType={event.eventType} />
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    "font-medium",
                                    eventTypeMap[event.eventType as keyof typeof eventTypeMap]?.color,
                                  )}
                                >
                                  {eventTypeMap[event.eventType as keyof typeof eventTypeMap]?.label}
                                </Badge>
                              </div>
                            </td>
                            <td className="p-4 align-middle">
                              <div className="flex items-center gap-2">
                                <img
                                  src={event.user.avatar || "/placeholder.svg"}
                                  alt={event.user.name}
                                  className="h-6 w-6 rounded-full"
                                />
                                <div>
                                  <div className="font-medium">{event.user.name}</div>
                                  <div className="text-xs text-muted-foreground">{event.user.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="p-4 align-middle">
                              <div className="font-medium">{event.contractName}</div>
                            </td>
                            <td className="p-4 align-middle">
                              <AuditEventDetails event={event} />
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="month" className="mt-6">
          {/* Same structure as other tabs */}
          <Card>
            <CardContent className="p-0">
              <div className="rounded-md border">
                <div className="relative w-full overflow-auto">
                  <table className="w-full caption-bottom text-sm">
                    <thead>
                      <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <th className="h-12 px-4 text-left align-middle font-medium">Waktu</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Aktivitas</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Pengguna</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Kontrak</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Detail</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEvents.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="h-24 text-center text-muted-foreground">
                            Tidak ada data audit yang ditemukan untuk bulan ini
                          </td>
                        </tr>
                      ) : (
                        filteredEvents.map((event) => (
                          <tr
                            key={event.id}
                            className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                          >
                            <td className="p-4 align-middle">
                              <div className="font-medium">{format(event.timestamp, "dd MMM yyyy")}</div>
                              <div className="text-xs text-muted-foreground">{format(event.timestamp, "HH:mm")}</div>
                            </td>
                            <td className="p-4 align-middle">
                              <div className="flex items-center gap-2">
                                <AuditEventTypeIcon eventType={event.eventType} />
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    "font-medium",
                                    eventTypeMap[event.eventType as keyof typeof eventTypeMap]?.color,
                                  )}
                                >
                                  {eventTypeMap[event.eventType as keyof typeof eventTypeMap]?.label}
                                </Badge>
                              </div>
                            </td>
                            <td className="p-4 align-middle">
                              <div className="flex items-center gap-2">
                                <img
                                  src={event.user.avatar || "/placeholder.svg"}
                                  alt={event.user.name}
                                  className="h-6 w-6 rounded-full"
                                />
                                <div>
                                  <div className="font-medium">{event.user.name}</div>
                                  <div className="text-xs text-muted-foreground">{event.user.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="p-4 align-middle">
                              <div className="font-medium">{event.contractName}</div>
                            </td>
                            <td className="p-4 align-middle">
                              <AuditEventDetails event={event} />
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

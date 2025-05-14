"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, ExternalLink, RefreshCw, Search, User, Building, FileText } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

// Mock data for CRM data
const crmData = {
  integration: {
    name: "Salesforce",
    icon: "/placeholder.svg?height=40&width=40",
    lastSync: "Today at 09:45 AM",
  },
  contract: {
    id: "SF-OPP-12345",
    name: "Service Agreement - Acme Inc",
    type: "Service Agreement",
    stage: "Negotiation",
    amount: "$75,000",
    probability: "80%",
    closeDate: "May 10, 2026",
    owner: "Sarah Johnson",
    url: "#",
  },
  company: {
    id: "SF-ACC-5678",
    name: "Acme Inc",
    industry: "Technology",
    type: "Customer",
    website: "https://www.acmeinc.com",
    employees: "1,000-5,000",
    revenue: "$50M-$100M",
    address: "123 Main St, San Francisco, CA 94105",
    phone: "(555) 123-4567",
    url: "#",
  },
  contacts: [
    {
      id: "SF-CON-9012",
      name: "John Smith",
      title: "Chief Technology Officer",
      email: "john.smith@acmeinc.com",
      phone: "(555) 987-6543",
      lastActivity: "May 5, 2025",
      url: "#",
    },
    {
      id: "SF-CON-9013",
      name: "Jane Doe",
      title: "Procurement Manager",
      email: "jane.doe@acmeinc.com",
      phone: "(555) 456-7890",
      lastActivity: "May 3, 2025",
      url: "#",
    },
    {
      id: "SF-CON-9014",
      name: "Robert Johnson",
      title: "Legal Counsel",
      email: "robert.johnson@acmeinc.com",
      phone: "(555) 234-5678",
      lastActivity: "May 1, 2025",
      url: "#",
    },
  ],
  activities: [
    {
      id: "SF-ACT-1234",
      type: "Email",
      subject: "Contract Draft Review",
      date: "May 4, 2025",
      description: "Sent contract draft for internal review",
      related: "John Smith",
      url: "#",
    },
    {
      id: "SF-ACT-1235",
      type: "Meeting",
      subject: "Negotiation Call",
      date: "May 2, 2025",
      description: "Discussed contract terms and pricing",
      related: "Jane Doe, Robert Johnson",
      url: "#",
    },
    {
      id: "SF-ACT-1236",
      type: "Task",
      subject: "Prepare Final Draft",
      date: "May 1, 2025",
      description: "Incorporate feedback and prepare final draft",
      related: "Sarah Johnson",
      url: "#",
    },
  ],
}

export default function ContractCrmPage({ params }: { params: { id: string } }) {
  const [searchQuery, setSearchQuery] = useState("")

  // Filter contacts based on search query
  const filteredContacts = crmData.contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.title.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <Button variant="ghost" size="icon" asChild className="mr-2">
            <Link href={`/dashboard/contracts/${params.id}`}>
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-lg font-semibold">CRM Data</h1>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Contract ID: {params.id}</span>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <img
                src={crmData.integration.icon || "/placeholder.svg"}
                alt={crmData.integration.name}
                className="h-5 w-5"
              />
              <span>Connected to {crmData.integration.name}</span>
              <Badge variant="outline" className="ml-2">
                Last synced: {crmData.integration.lastSync}
              </Badge>
            </div>
            <Button variant="outline" size="sm" className="gap-1">
              <RefreshCw className="h-4 w-4" />
              Sync Now
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-6">
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="contacts">Contacts</TabsTrigger>
              <TabsTrigger value="activities">Activities</TabsTrigger>
              <TabsTrigger value="settings">Sync Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="space-y-1">
                      <CardTitle>Contract in {crmData.integration.name}</CardTitle>
                      <CardDescription>How this contract appears in your CRM</CardDescription>
                    </div>
                    <FileText className="h-5 w-5 text-muted-foreground" />
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">CRM ID</p>
                          <p>{crmData.contract.id}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">Stage</p>
                          <p>{crmData.contract.stage}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">Amount</p>
                          <p>{crmData.contract.amount}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">Probability</p>
                          <p>{crmData.contract.probability}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">Close Date</p>
                          <p>{crmData.contract.closeDate}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">Owner</p>
                          <p>{crmData.contract.owner}</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" asChild className="w-full mt-4">
                        <a
                          href={crmData.contract.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-1"
                        >
                          View in {crmData.integration.name}
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="space-y-1">
                      <CardTitle>Company Information</CardTitle>
                      <CardDescription>Company details from your CRM</CardDescription>
                    </div>
                    <Building className="h-5 w-5 text-muted-foreground" />
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">Company Name</p>
                          <p>{crmData.company.name}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">Industry</p>
                          <p>{crmData.company.industry}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">Type</p>
                          <p>{crmData.company.type}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">Employees</p>
                          <p>{crmData.company.employees}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">Annual Revenue</p>
                          <p>{crmData.company.revenue}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">Website</p>
                          <p className="truncate">{crmData.company.website}</p>
                        </div>
                      </div>
                      <div className="space-y-1 mt-2">
                        <p className="text-sm font-medium text-muted-foreground">Address</p>
                        <p>{crmData.company.address}</p>
                      </div>
                      <Button variant="outline" size="sm" asChild className="w-full mt-4">
                        <a
                          href={crmData.company.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-1"
                        >
                          View in {crmData.integration.name}
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Key Contacts</CardTitle>
                  <CardDescription>Primary contacts associated with this contract</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-3">
                    {crmData.contacts.slice(0, 3).map((contact) => (
                      <div key={contact.id} className="flex flex-col items-center text-center p-4 border rounded-lg">
                        <Avatar className="h-16 w-16 mb-2">
                          <AvatarFallback>
                            {contact.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <h3 className="font-medium">{contact.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{contact.title}</p>
                        <div className="space-y-1 w-full text-sm">
                          <p className="truncate">{contact.email}</p>
                          <p>{contact.phone}</p>
                        </div>
                        <Button variant="ghost" size="sm" asChild className="mt-4">
                          <a
                            href={contact.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1"
                          >
                            View Profile
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </a>
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <Button variant="outline" asChild>
                    <Link href="#contacts">View All Contacts</Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activities</CardTitle>
                  <CardDescription>Recent activities related to this contract in your CRM</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {crmData.activities.slice(0, 3).map((activity) => (
                      <div key={activity.id} className="flex items-start gap-4 p-4 border rounded-lg">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                          <FileText className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium">{activity.subject}</p>
                            <Badge variant="outline">{activity.type}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{activity.description}</p>
                          <div className="flex items-center justify-between text-sm">
                            <p className="text-muted-foreground">Related to: {activity.related}</p>
                            <p className="text-muted-foreground">{activity.date}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" asChild>
                          <a href={activity.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <Button variant="outline" asChild>
                    <Link href="#activities">View All Activities</Link>
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="contacts" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <CardTitle>Contacts</CardTitle>
                      <CardDescription>
                        All contacts associated with this contract in {crmData.integration.name}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="search"
                          placeholder="Search contacts..."
                          className="pl-8 w-[250px]"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                      <Button variant="outline" size="sm">
                        <User className="h-4 w-4 mr-2" />
                        Add Contact
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <table className="min-w-full divide-y divide-border">
                      <thead>
                        <tr className="bg-muted/50">
                          <th className="px-4 py-3 text-left text-sm font-medium">Name</th>
                          <th className="px-4 py-3 text-left text-sm font-medium">Title</th>
                          <th className="px-4 py-3 text-left text-sm font-medium">Email</th>
                          <th className="px-4 py-3 text-left text-sm font-medium">Phone</th>
                          <th className="px-4 py-3 text-left text-sm font-medium">Last Activity</th>
                          <th className="px-4 py-3 text-left text-sm font-medium"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {filteredContacts.map((contact) => (
                          <tr key={contact.id}>
                            <td className="px-4 py-3 text-sm">{contact.name}</td>
                            <td className="px-4 py-3 text-sm">{contact.title}</td>
                            <td className="px-4 py-3 text-sm">{contact.email}</td>
                            <td className="px-4 py-3 text-sm">{contact.phone}</td>
                            <td className="px-4 py-3 text-sm">{contact.lastActivity}</td>
                            <td className="px-4 py-3 text-sm text-right">
                              <Button variant="ghost" size="sm" asChild>
                                <a href={contact.url} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="h-4 w-4" />
                                </a>
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activities" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <CardTitle>Activities</CardTitle>
                      <CardDescription>
                        All activities related to this contract in {crmData.integration.name}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Select defaultValue="all">
                        <SelectTrigger className="w-[150px]">
                          <SelectValue placeholder="Filter by type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="meeting">Meeting</SelectItem>
                          <SelectItem value="task">Task</SelectItem>
                          <SelectItem value="call">Call</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="outline" size="sm">
                        Add Activity
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {crmData.activities.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-4 p-4 border rounded-lg">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                          <FileText className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium">{activity.subject}</p>
                            <Badge variant="outline">{activity.type}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{activity.description}</p>
                          <div className="flex items-center justify-between text-sm">
                            <p className="text-muted-foreground">Related to: {activity.related}</p>
                            <p className="text-muted-foreground">{activity.date}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" asChild>
                          <a href={activity.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Sync Settings</CardTitle>
                  <CardDescription>Configure how this contract syncs with {crmData.integration.name}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Field Mapping</h3>
                    <div className="rounded-md border">
                      <table className="min-w-full divide-y divide-border">
                        <thead>
                          <tr className="bg-muted/50">
                            <th className="px-4 py-3 text-left text-sm font-medium">KontrakPro Field</th>
                            <th className="px-4 py-3 text-left text-sm font-medium">
                              {crmData.integration.name} Field
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-medium">Sync Direction</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          <tr>
                            <td className="px-4 py-3 text-sm">Contract Name</td>
                            <td className="px-4 py-3 text-sm">Opportunity Name</td>
                            <td className="px-4 py-3 text-sm">Bi-directional</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 text-sm">Contract Value</td>
                            <td className="px-4 py-3 text-sm">Amount</td>
                            <td className="px-4 py-3 text-sm">Bi-directional</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 text-sm">Status</td>
                            <td className="px-4 py-3 text-sm">Stage</td>
                            <td className="px-4 py-3 text-sm">Bi-directional</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 text-sm">Start Date</td>
                            <td className="px-4 py-3 text-sm">Start Date</td>
                            <td className="px-4 py-3 text-sm">KontrakPro to CRM</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 text-sm">End Date</td>
                            <td className="px-4 py-3 text-sm">Close Date</td>
                            <td className="px-4 py-3 text-sm">KontrakPro to CRM</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <Button variant="outline" size="sm">
                      Edit Field Mapping
                    </Button>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Sync Frequency</h3>
                    <div className="flex items-center space-x-2">
                      <Select defaultValue="15">
                        <SelectTrigger className="w-[280px]">
                          <SelectValue placeholder="Select sync frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">Every 5 minutes</SelectItem>
                          <SelectItem value="15">Every 15 minutes</SelectItem>
                          <SelectItem value="30">Every 30 minutes</SelectItem>
                          <SelectItem value="60">Every hour</SelectItem>
                          <SelectItem value="daily">Once a day</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Advanced Settings</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="auto-create">Auto-create in CRM</Label>
                          <p className="text-sm text-muted-foreground">
                            Automatically create new records in {crmData.integration.name} when created in KontrakPro
                          </p>
                        </div>
                        <Select defaultValue="enabled">
                          <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="enabled">Enabled</SelectItem>
                            <SelectItem value="disabled">Disabled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="conflict-resolution">Conflict Resolution</Label>
                          <p className="text-sm text-muted-foreground">
                            How to handle conflicts when the same record is updated in both systems
                          </p>
                        </div>
                        <Select defaultValue="latest">
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="latest">Most Recent Wins</SelectItem>
                            <SelectItem value="kontrakpro">KontrakPro Wins</SelectItem>
                            <SelectItem value="crm">CRM Wins</SelectItem>
                            <SelectItem value="manual">Manual Resolution</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Reset to Default</Button>
                  <Button>Save Settings</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

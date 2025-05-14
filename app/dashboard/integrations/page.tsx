"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, ExternalLink, Search, Settings } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data for available integrations
const availableIntegrations = [
  {
    id: "salesforce",
    name: "Salesforce",
    description: "Connect your Salesforce account to sync contacts, opportunities, and accounts with your contracts.",
    category: "crm",
    icon: "/placeholder.svg?height=40&width=40",
    popular: true,
  },
  {
    id: "hubspot",
    name: "HubSpot",
    description: "Integrate with HubSpot to manage contracts alongside your customer relationships.",
    category: "crm",
    icon: "/placeholder.svg?height=40&width=40",
    popular: true,
  },
  {
    id: "zoho",
    name: "Zoho CRM",
    description: "Connect Zoho CRM to streamline your contract management process.",
    category: "crm",
    icon: "/placeholder.svg?height=40&width=40",
    popular: false,
  },
  {
    id: "pipedrive",
    name: "Pipedrive",
    description: "Link your Pipedrive deals directly to contracts in KontrakPro.",
    category: "crm",
    icon: "/placeholder.svg?height=40&width=40",
    popular: false,
  },
  {
    id: "microsoft-dynamics",
    name: "Microsoft Dynamics 365",
    description: "Connect your Microsoft Dynamics 365 instance for seamless contract integration.",
    category: "crm",
    icon: "/placeholder.svg?height=40&width=40",
    popular: false,
  },
  {
    id: "sugarcrm",
    name: "SugarCRM",
    description: "Integrate SugarCRM to enhance your contract lifecycle management.",
    category: "crm",
    icon: "/placeholder.svg?height=40&width=40",
    popular: false,
  },
  {
    id: "freshsales",
    name: "Freshsales",
    description: "Connect Freshsales to manage contracts within your sales pipeline.",
    category: "crm",
    icon: "/placeholder.svg?height=40&width=40",
    popular: false,
  },
  {
    id: "insightly",
    name: "Insightly",
    description: "Link Insightly projects and opportunities with your contracts.",
    category: "crm",
    icon: "/placeholder.svg?height=40&width=40",
    popular: false,
  },
  {
    id: "google-drive",
    name: "Google Drive",
    description: "Store and access your contracts directly from Google Drive.",
    category: "storage",
    icon: "/placeholder.svg?height=40&width=40",
    popular: true,
  },
  {
    id: "dropbox",
    name: "Dropbox",
    description: "Sync your contracts with Dropbox for easy access and sharing.",
    category: "storage",
    icon: "/placeholder.svg?height=40&width=40",
    popular: false,
  },
  {
    id: "onedrive",
    name: "OneDrive",
    description: "Store your contracts in OneDrive for seamless Microsoft integration.",
    category: "storage",
    icon: "/placeholder.svg?height=40&width=40",
    popular: false,
  },
  {
    id: "slack",
    name: "Slack",
    description: "Get notifications and updates about your contracts directly in Slack.",
    category: "communication",
    icon: "/placeholder.svg?height=40&width=40",
    popular: true,
  },
  {
    id: "teams",
    name: "Microsoft Teams",
    description: "Collaborate on contracts and receive updates in Microsoft Teams.",
    category: "communication",
    icon: "/placeholder.svg?height=40&width=40",
    popular: false,
  },
  {
    id: "docusign",
    name: "DocuSign",
    description: "Use DocuSign for electronic signatures on your contracts.",
    category: "esignature",
    icon: "/placeholder.svg?height=40&width=40",
    popular: true,
  },
  {
    id: "adobe-sign",
    name: "Adobe Sign",
    description: "Integrate with Adobe Sign for electronic signatures.",
    category: "esignature",
    icon: "/placeholder.svg?height=40&width=40",
    popular: false,
  },
]

// Mock data for active integrations
const activeIntegrations = [
  {
    id: "salesforce",
    name: "Salesforce",
    status: "active",
    lastSync: "Today at 09:45 AM",
    connectedBy: "Sarah Johnson",
    connectedOn: "May 10, 2025",
    icon: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "slack",
    name: "Slack",
    status: "active",
    lastSync: "Today at 10:30 AM",
    connectedBy: "Michael Chen",
    connectedOn: "May 8, 2025",
    icon: "/placeholder.svg?height=40&width=40",
  },
]

export default function IntegrationsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")

  // Filter integrations based on search query and category
  const filteredIntegrations = availableIntegrations.filter((integration) => {
    const matchesSearch =
      integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      integration.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === "all" || integration.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  return (
    <div className="container py-6 space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Integrations</h1>
        <p className="text-muted-foreground">Connect KontrakPro with your favorite tools and services</p>
      </div>

      <Tabs defaultValue="available" className="space-y-6">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="available">Available Integrations</TabsTrigger>
            <TabsTrigger value="active">Active Integrations</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/integrations/settings">
                <Settings className="h-4 w-4 mr-2" />
                Integration Settings
              </Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/dashboard/integrations/activity">
                View Integration Activity
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>

        <TabsContent value="available" className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search integrations..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="crm">CRM</SelectItem>
                <SelectItem value="storage">Storage</SelectItem>
                <SelectItem value="communication">Communication</SelectItem>
                <SelectItem value="esignature">E-Signature</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {categoryFilter === "all" && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Popular CRM Integrations</h2>
                  <Button variant="link" size="sm" asChild>
                    <Link href="/dashboard/integrations/category/crm">
                      View all CRM integrations
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Link>
                  </Button>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {availableIntegrations
                    .filter((integration) => integration.category === "crm" && integration.popular)
                    .map((integration) => (
                      <IntegrationCard key={integration.id} integration={integration} />
                    ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h2 className="text-xl font-semibold">All Integrations</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredIntegrations.map((integration) => (
                    <IntegrationCard key={integration.id} integration={integration} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {categoryFilter !== "all" && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">
                {categoryFilter.charAt(0).toUpperCase() + categoryFilter.slice(1)} Integrations
              </h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredIntegrations.map((integration) => (
                  <IntegrationCard key={integration.id} integration={integration} />
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="active">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Your Active Integrations</h2>
              <Button variant="outline" size="sm">
                Sync All
              </Button>
            </div>

            <div className="space-y-4">
              {activeIntegrations.length > 0 ? (
                activeIntegrations.map((integration) => (
                  <Card key={integration.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-md overflow-hidden">
                          <img
                            src={integration.icon || "/placeholder.svg"}
                            alt={integration.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{integration.name}</h3>
                              <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
                                {integration.status}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm">
                                Sync Now
                              </Button>
                              <Button variant="ghost" size="sm" asChild>
                                <Link href={`/dashboard/integrations/${integration.id}/settings`}>
                                  <Settings className="h-4 w-4" />
                                </Link>
                              </Button>
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground">Last synced: {integration.lastSync}</div>
                          <div className="text-sm text-muted-foreground">
                            Connected by {integration.connectedBy} on {integration.connectedOn}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                    <ExternalLink className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No active integrations</h3>
                  <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                    Connect KontrakPro with your favorite tools to streamline your contract management workflow.
                  </p>
                  <Button asChild>
                    <Link href="#available">Browse Available Integrations</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function IntegrationCard({ integration }) {
  const isActive = activeIntegrations.some((active) => active.id === integration.id)

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-6 pb-3">
        <div className="flex items-start justify-between">
          <div className="h-10 w-10 rounded-md overflow-hidden">
            <img
              src={integration.icon || "/placeholder.svg"}
              alt={integration.name}
              className="h-full w-full object-cover"
            />
          </div>
          {integration.popular && (
            <Badge variant="secondary" className="ml-auto">
              Popular
            </Badge>
          )}
        </div>
        <CardTitle className="mt-4">{integration.name}</CardTitle>
        <CardDescription>{integration.description}</CardDescription>
      </CardHeader>
      <CardFooter className="p-6 pt-3 flex justify-between">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/dashboard/integrations/${integration.id}`}>Learn More</Link>
        </Button>
        <Button size="sm" disabled={isActive}>
          {isActive ? "Connected" : "Connect"}
        </Button>
      </CardFooter>
    </Card>
  )
}

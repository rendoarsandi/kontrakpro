"use client"

import { useState } from "react"
import { ChevronDown, FileText, Filter, FolderOpen, Plus, Search, SlidersHorizontal } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function RepositoryPage() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search repository..."
              className="w-full pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1">
              <SlidersHorizontal className="h-4 w-4" />
              Advanced Search
            </Button>
            <Button size="sm" className="gap-1">
              <Plus className="h-4 w-4" />
              Upload Document
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight">Repository</h1>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-1">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
              <Button variant="outline" size="sm" className="gap-1">
                Sort by: Recent
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Tabs defaultValue="all" className="mt-6">
            <TabsList>
              <TabsTrigger value="all">All Documents</TabsTrigger>
              <TabsTrigger value="contracts">Contracts</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
              <TabsTrigger value="supporting">Supporting Documents</TabsTrigger>
            </TabsList>

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="overflow-hidden">
                <CardHeader className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-base">Service Agreement - Acme Inc</CardTitle>
                      <CardDescription>Service Agreement</CardDescription>
                    </div>
                    <Badge>Active</Badge>
                  </div>
                </CardHeader>
                <Separator />
                <CardContent className="p-4 pt-0 flex flex-col">
                  <div className="flex items-center justify-between py-4">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">12 pages</span>
                    </div>
                    <div className="text-xs text-muted-foreground">Last updated: May 10, 2025</div>
                  </div>
                  <div className="mt-auto flex justify-end gap-2">
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                    <Button size="sm">Download</Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="overflow-hidden">
                <CardHeader className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-base">NDA - XYZ Corp</CardTitle>
                      <CardDescription>Non-Disclosure Agreement</CardDescription>
                    </div>
                    <Badge variant="outline">Active</Badge>
                  </div>
                </CardHeader>
                <Separator />
                <CardContent className="p-4 pt-0 flex flex-col">
                  <div className="flex items-center justify-between py-4">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">5 pages</span>
                    </div>
                    <div className="text-xs text-muted-foreground">Last updated: Apr 15, 2025</div>
                  </div>
                  <div className="mt-auto flex justify-end gap-2">
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                    <Button size="sm">Download</Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="overflow-hidden">
                <CardHeader className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-base">Employment Contract - Jane Smith</CardTitle>
                      <CardDescription>Employment Contract</CardDescription>
                    </div>
                    <Badge variant="outline">Active</Badge>
                  </div>
                </CardHeader>
                <Separator />
                <CardContent className="p-4 pt-0 flex flex-col">
                  <div className="flex items-center justify-between py-4">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">8 pages</span>
                    </div>
                    <div className="text-xs text-muted-foreground">Last updated: Mar 22, 2025</div>
                  </div>
                  <div className="mt-auto flex justify-end gap-2">
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                    <Button size="sm">Download</Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="overflow-hidden">
                <CardHeader className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-base">Software License - TechCorp</CardTitle>
                      <CardDescription>License Agreement</CardDescription>
                    </div>
                    <Badge variant="secondary">Draft</Badge>
                  </div>
                </CardHeader>
                <Separator />
                <CardContent className="p-4 pt-0 flex flex-col">
                  <div className="flex items-center justify-between py-4">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">10 pages</span>
                    </div>
                    <div className="text-xs text-muted-foreground">Last updated: May 5, 2025</div>
                  </div>
                  <div className="mt-auto flex justify-end gap-2">
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                    <Button size="sm">Download</Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="overflow-hidden">
                <CardHeader className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-base">Vendor Agreement - Supplier Inc</CardTitle>
                      <CardDescription>Vendor Agreement</CardDescription>
                    </div>
                    <Badge variant="destructive">Expired</Badge>
                  </div>
                </CardHeader>
                <Separator />
                <CardContent className="p-4 pt-0 flex flex-col">
                  <div className="flex items-center justify-between py-4">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">15 pages</span>
                    </div>
                    <div className="text-xs text-muted-foreground">Last updated: Jan 10, 2024</div>
                  </div>
                  <div className="mt-auto flex justify-end gap-2">
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                    <Button size="sm">Download</Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="overflow-hidden">
                <CardHeader className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-base">Standard Service Agreement Template</CardTitle>
                      <CardDescription>Template</CardDescription>
                    </div>
                    <Badge variant="secondary">Template</Badge>
                  </div>
                </CardHeader>
                <Separator />
                <CardContent className="p-4 pt-0 flex flex-col">
                  <div className="flex items-center justify-between py-4">
                    <div className="flex items-center gap-2">
                      <FolderOpen className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Template</span>
                    </div>
                    <div className="text-xs text-muted-foreground">Last updated: Apr 15, 2025</div>
                  </div>
                  <div className="mt-auto flex justify-end gap-2">
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                    <Button size="sm">Use Template</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

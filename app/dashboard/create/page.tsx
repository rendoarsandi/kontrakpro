"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Check, ChevronDown, Upload, Filter } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

import DocumentUpload from "@/components/document-upload"
const contractTypes = [
  { value: "service", label: "Service Agreement" },
  { value: "nda", label: "Non-Disclosure Agreement" },
  { value: "employment", label: "Employment Contract" },
  { value: "vendor", label: "Vendor Agreement" },
  { value: "license", label: "License Agreement" },
  { value: "partnership", label: "Partnership Agreement" },
  { value: "lease", label: "Lease Agreement" },
  { value: "custom", label: "Custom Contract" },
]

const templates = [
  {
    id: "1",
    name: "Standard Service Agreement",
    description: "For general service engagements with standard terms and conditions",
    type: "Service Agreement",
    lastUpdated: "Apr 15, 2025",
  },
  {
    id: "2",
    name: "Mutual NDA",
    description: "Two-way confidentiality agreement for business discussions",
    type: "NDA",
    lastUpdated: "Mar 22, 2025",
  },
  {
    id: "3",
    name: "Full-Time Employment Contract",
    description: "Standard employment agreement for full-time employees",
    type: "Employment",
    lastUpdated: "Feb 10, 2025",
  },
  {
    id: "4",
    name: "Software License Agreement",
    description: "For licensing software products to customers",
    type: "License",
    lastUpdated: "May 5, 2025",
  },
  {
    id: "5",
    name: "Vendor Services Agreement",
    description: "For engaging third-party service providers",
    type: "Vendor",
    lastUpdated: "Jan 30, 2025",
  },
  {
    id: "6",
    name: "Office Lease Agreement",
    description: "For leasing office space or equipment",
    type: "Lease",
    lastUpdated: "Dec 12, 2024",
  },
]

export default function CreateContractPage() {
  const [selectedTab, setSelectedTab] = useState("template")
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [contractType, setContractType] = useState("")
  const [open, setOpen] = useState(false)

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <Button variant="ghost" size="icon" asChild className="mr-2">
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <h1 className="text-lg font-semibold">Create New Contract</h1>
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-6">
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="template">Use Template</TabsTrigger>
              <TabsTrigger value="upload">Upload Document</TabsTrigger>
            </TabsList>

            <TabsContent value="template" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-medium">Select a Template</h2>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" className="h-8 gap-1 border-dashed">
                          <Filter className="h-3.5 w-3.5" />
                          Filter
                          <ChevronDown className="h-3.5 w-3.5" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0" align="end">
                        <Command>
                          <CommandInput placeholder="Filter templates..." />
                          <CommandList>
                            <CommandEmpty>No results found.</CommandEmpty>
                            <CommandGroup>
                              {contractTypes.map((type) => (
                                <CommandItem
                                  key={type.value}
                                  value={type.value}
                                  onSelect={(value) => {
                                    setContractType(value === contractType ? "" : value)
                                    setOpen(false)
                                  }}
                                >
                                  <Check
                                    className={`mr-2 h-4 w-4 ${
                                      contractType === type.value ? "opacity-100" : "opacity-0"
                                    }`}
                                  />
                                  {type.label}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2 pr-4 max-h-[600px] overflow-y-auto">
                    {templates
                      .filter((template) => !contractType || template.type.toLowerCase().includes(contractType))
                      .map((template) => (
                        <div
                          key={template.id}
                          className={`rounded-lg border p-4 transition-colors hover:bg-muted/50 cursor-pointer ${
                            selectedTemplate === template.id ? "border-primary bg-muted/50" : ""
                          }`}
                          onClick={() => setSelectedTemplate(template.id)}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-medium">{template.name}</h3>
                              <p className="text-sm text-muted-foreground">{template.description}</p>
                            </div>
                            {selectedTemplate === template.id && <Check className="h-5 w-5 text-primary" />}
                          </div>
                          <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                            <span>{template.type}</span>
                            <span>Last updated: {template.lastUpdated}</span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                <div>
                  <h2 className="mb-4 text-lg font-medium">Contract Details</h2>
                  <Card>
                    <CardContent className="pt-6 space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="contract-name">Contract Name</Label>
                        <Input id="contract-name" placeholder="Enter contract name" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="counterparty">Counterparty</Label>
                        <Input id="counterparty" placeholder="Enter company or individual name" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          placeholder="Brief description of the contract"
                          className="min-h-[100px]"
                        />
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="effective-date">Effective Date</Label>
                          <Input id="effective-date" type="date" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="expiry-date">Expiry Date</Label>
                          <Input id="expiry-date" type="date" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Contract Value</Label>
                        <div className="flex">
                          <select className="rounded-l-md border border-r-0 bg-muted px-3 py-2 text-sm">
                            <option>USD</option>
                            <option>EUR</option>
                            <option>GBP</option>
                          </select>
                          <Input className="rounded-l-none" placeholder="Enter amount" />
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <Label>Approval Workflow</Label>
                        <RadioGroup defaultValue="standard">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="standard" id="workflow-standard" />
                            <Label htmlFor="workflow-standard">Standard Workflow</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="expedited" id="workflow-expedited" />
                            <Label htmlFor="workflow-expedited">Expedited Workflow</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="custom" id="workflow-custom" />
                            <Label htmlFor="workflow-custom">Custom Workflow</Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div className="space-y-2">
                        <Label>Additional Options</Label>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox id="auto-renew" />
                            <Label htmlFor="auto-renew">Enable auto-renewal</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="reminder" />
                            <Label htmlFor="reminder">Set renewal reminder (30 days before expiry)</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="e-signature" />
                            <Label htmlFor="e-signature">Enable e-signature</Label>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline">Save as Draft</Button>
                      <Button>Create Contract</Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="upload" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Upload Contract Document</CardTitle>
                  <CardDescription>Upload an existing contract document to start the approval process</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <DocumentUpload />
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="upload-name">Contract Name</Label>
                      <Input id="upload-name" placeholder="Enter contract name" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="upload-type">Contract Type</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" role="combobox" className="w-full justify-between">
                            {contractType
                              ? contractTypes.find((type) => type.value === contractType)?.label
                              : "Select contract type"}
                            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput placeholder="Search contract type..." />
                            <CommandList>
                              <CommandEmpty>No contract type found.</CommandEmpty>
                              <CommandGroup>
                                {contractTypes.map((type) => (
                                  <CommandItem
                                    key={type.value}
                                    value={type.value}
                                    onSelect={(value) => {
                                      setContractType(value)
                                    }}
                                  >
                                    <Check
                                      className={`mr-2 h-4 w-4 ${
                                        contractType === type.value ? "opacity-100" : "opacity-0"
                                      }`}
                                    />
                                    {type.label}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="upload-effective-date">Effective Date</Label>
                        <Input id="upload-effective-date" type="date" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="upload-expiry-date">Expiry Date</Label>
                        <Input id="upload-expiry-date" type="date" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Approval Workflow</Label>
                      <RadioGroup defaultValue="standard">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="standard" id="upload-workflow-standard" />
                          <Label htmlFor="upload-workflow-standard">Standard Workflow</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="expedited" id="upload-workflow-expedited" />
                          <Label htmlFor="upload-workflow-expedited">Expedited Workflow</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="custom" id="upload-workflow-custom" />
                          <Label htmlFor="upload-workflow-custom">Custom Workflow</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Save as Draft</Button>
                  <Button>Upload and Process</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

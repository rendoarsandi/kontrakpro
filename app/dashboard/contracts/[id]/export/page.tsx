"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { PDFPreview } from "@/components/pdf/pdf-preview"
import { Switch } from "@/components/ui/switch"

export default function ContractExportPage({ params }: { params: { id: string } }) {
  const [includeSignatures, setIncludeSignatures] = useState(true)
  const [includeWatermark, setIncludeWatermark] = useState(false)
  const [companyLogo, setCompanyLogo] = useState("/placeholder.svg")

  // Mock contract data - in a real app, this would be fetched from an API
  const contract = {
    id: params.id,
    name: "Service Agreement - Acme Inc",
    status: "Pending Approval",
    type: "Service Agreement",
    created: "May 10, 2025",
    expiry: "May 10, 2026",
    owner: "Sarah Johnson",
    counterparty: "Acme Inc",
    value: "$75,000",
    description:
      "This Service Agreement outlines the terms and conditions for providing software development and maintenance services to Acme Inc for their customer relationship management system.",
    approvalSteps: [
      { name: "Legal Review", status: "completed", user: "Michael Chen", date: "May 11, 2025" },
      { name: "Finance Review", status: "completed", user: "Jennifer Wong", date: "May 12, 2025" },
      { name: "Department Head", status: "current", user: "Robert Lee", date: "" },
      { name: "Executive Approval", status: "pending", user: "CEO", date: "" },
      { name: "Counterparty Signature", status: "pending", user: "Acme Inc", date: "" },
    ],
  }

  return (
    <div className="container py-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" asChild className="mr-2">
          <Link href={`/dashboard/contracts/${params.id}`}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Export Contract</h1>
          <p className="text-muted-foreground">Preview and customize your PDF export</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <div className="md:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>PDF Preview</CardTitle>
              <CardDescription>This is how your exported PDF will look</CardDescription>
            </CardHeader>
            <CardContent>
              <PDFPreview
                contract={contract}
                includeSignatures={includeSignatures}
                includeWatermark={includeWatermark}
                companyLogo={companyLogo}
              />
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Export Options</CardTitle>
              <CardDescription>Customize your PDF export</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="include-signatures">Include Signature Fields</Label>
                  <Switch id="include-signatures" checked={includeSignatures} onCheckedChange={setIncludeSignatures} />
                </div>
                <p className="text-xs text-muted-foreground">Add signature fields at the end of the document</p>
              </div>

              <div className="flex flex-col space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="include-watermark">Include Draft Watermark</Label>
                  <Switch id="include-watermark" checked={includeWatermark} onCheckedChange={setIncludeWatermark} />
                </div>
                <p className="text-xs text-muted-foreground">Add a "DRAFT" watermark to the document</p>
              </div>

              <div className="pt-4">
                <Button className="w-full">Download PDF</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

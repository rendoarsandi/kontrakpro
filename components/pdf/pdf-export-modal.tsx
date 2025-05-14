"use client"

import { useState } from "react"
import { PDFDownloadLink } from "@react-pdf/renderer"
import { Download, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ContractPDFTemplate } from "./contract-pdf-template"

interface PDFExportModalProps {
  isOpen: boolean
  onClose: () => void
  contract: any
}

export function PDFExportModal({ isOpen, onClose, contract }: PDFExportModalProps) {
  const [includeSignatures, setIncludeSignatures] = useState(true)
  const [includeWatermark, setIncludeWatermark] = useState(false)
  const [companyLogo, setCompanyLogo] = useState("/placeholder.svg")

  const fileName = `${contract.name.replace(/\s+/g, "-").toLowerCase()}-${new Date().toISOString().split("T")[0]}.pdf`

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Export Contract to PDF</DialogTitle>
          <DialogDescription>
            Configure the options for your PDF export. Click Export when you're ready.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="include-signatures" className="flex flex-col space-y-1">
              <span>Include Signature Fields</span>
              <span className="font-normal text-xs text-muted-foreground">
                Add signature fields at the end of the document
              </span>
            </Label>
            <Switch id="include-signatures" checked={includeSignatures} onCheckedChange={setIncludeSignatures} />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="include-watermark" className="flex flex-col space-y-1">
              <span>Include Draft Watermark</span>
              <span className="font-normal text-xs text-muted-foreground">Add a "DRAFT" watermark to the document</span>
            </Label>
            <Switch id="include-watermark" checked={includeWatermark} onCheckedChange={setIncludeWatermark} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <PDFDownloadLink
            document={
              <ContractPDFTemplate
                contract={contract}
                includeSignatures={includeSignatures}
                includeWatermark={includeWatermark}
                companyLogo={companyLogo}
              />
            }
            fileName={fileName}
            className="inline-flex"
          >
            {({ blob, url, loading, error }) => (
              <Button disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Export PDF
                  </>
                )}
              </Button>
            )}
          </PDFDownloadLink>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

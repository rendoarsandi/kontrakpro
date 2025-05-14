"use client"
import { PDFViewer } from "@react-pdf/renderer"
import { ContractPDFTemplate } from "./contract-pdf-template"

interface PDFPreviewProps {
  contract: any
  includeSignatures?: boolean
  includeWatermark?: boolean
  companyLogo?: string
}

export function PDFPreview({
  contract,
  includeSignatures = true,
  includeWatermark = false,
  companyLogo = "/placeholder.svg",
}: PDFPreviewProps) {
  return (
    <div className="w-full h-[600px] border rounded-md overflow-hidden">
      <PDFViewer width="100%" height="100%" style={{ border: "none" }}>
        <ContractPDFTemplate
          contract={contract}
          includeSignatures={includeSignatures}
          includeWatermark={includeWatermark}
          companyLogo={companyLogo}
        />
      </PDFViewer>
    </div>
  )
}

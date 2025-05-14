"use client"

import { useState } from "react"
import { Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { format } from "date-fns"

interface AuditEventDetailsProps {
  event: any
}

export function AuditEventDetails({ event }: AuditEventDetailsProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Function to render details based on event type
  const renderDetails = () => {
    switch (event.eventType) {
      case "contract_created":
        return (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm font-medium">Jenis Kontrak:</div>
              <div className="text-sm">{event.details.contractType}</div>
              <div className="text-sm font-medium">Nilai:</div>
              <div className="text-sm">{event.details.value}</div>
              <div className="text-sm font-medium">Pihak Terlibat:</div>
              <div className="text-sm">{event.details.parties.join(", ")}</div>
            </div>
          </div>
        )
      case "contract_updated":
        return (
          <div className="space-y-2">
            <div className="text-sm font-medium">Perubahan:</div>
            <ul className="list-disc list-inside space-y-1">
              {event.details.changes.map((change: any, index: number) => (
                <li key={index} className="text-sm">
                  {change.field}: <span className="line-through">{change.from}</span> → {change.to}
                </li>
              ))}
            </ul>
          </div>
        )
      case "contract_shared":
        return (
          <div className="space-y-2">
            <div className="text-sm font-medium">Dibagikan Kepada:</div>
            <ul className="list-disc list-inside space-y-1">
              {event.details.sharedWith.map((recipient: any, index: number) => (
                <li key={index} className="text-sm">
                  {recipient.name} {recipient.type === "external" ? "(Eksternal)" : ""}
                </li>
              ))}
            </ul>
            <div className="text-sm font-medium">Izin:</div>
            <div className="text-sm capitalize">{event.details.permissions}</div>
          </div>
        )
      case "contract_signed":
        return (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm font-medium">Jenis Tanda Tangan:</div>
              <div className="text-sm capitalize">{event.details.signatureType}</div>
              <div className="text-sm font-medium">Metode:</div>
              <div className="text-sm capitalize">{event.details.signatureMethod}</div>
              <div className="text-sm font-medium">Posisi:</div>
              <div className="text-sm">{event.details.signaturePosition}</div>
            </div>
          </div>
        )
      case "contract_approved":
        return (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm font-medium">Level Persetujuan:</div>
              <div className="text-sm capitalize">{event.details.approvalLevel}</div>
              <div className="text-sm font-medium">Komentar:</div>
              <div className="text-sm">{event.details.comments}</div>
            </div>
          </div>
        )
      case "contract_viewed":
        return (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm font-medium">Durasi Melihat:</div>
              <div className="text-sm">{event.details.viewDuration}</div>
              <div className="text-sm font-medium">Halaman Dilihat:</div>
              <div className="text-sm">{event.details.pagesViewed.join(", ")}</div>
            </div>
          </div>
        )
      case "ai_analysis_performed":
        return (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm font-medium">Jenis Analisis:</div>
              <div className="text-sm capitalize">{event.details.analysisType}</div>
              <div className="text-sm font-medium">Skor Risiko:</div>
              <div className="text-sm">{event.details.riskScore}/100</div>
              <div className="text-sm font-medium">Masalah Teridentifikasi:</div>
              <div className="text-sm">{event.details.issuesIdentified}</div>
              <div className="text-sm font-medium">Klausul Hilang:</div>
              <div className="text-sm">{event.details.missingClauses}</div>
            </div>
          </div>
        )
      case "contract_exported":
        return (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm font-medium">Format Ekspor:</div>
              <div className="text-sm">{event.details.exportFormat}</div>
              <div className="text-sm font-medium">Termasuk Lampiran:</div>
              <div className="text-sm">{event.details.includesAttachments ? "Ya" : "Tidak"}</div>
              <div className="text-sm font-medium">Termasuk Tanda Tangan:</div>
              <div className="text-sm">{event.details.includesSignatures ? "Ya" : "Tidak"}</div>
            </div>
          </div>
        )
      case "contract_archived":
        return (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm font-medium">Alasan:</div>
              <div className="text-sm">{event.details.reason}</div>
              <div className="text-sm font-medium">Periode Retensi:</div>
              <div className="text-sm">{event.details.retentionPeriod}</div>
            </div>
          </div>
        )
      case "permission_changed":
        return (
          <div className="space-y-2">
            <div className="text-sm font-medium">Pengguna Terpengaruh:</div>
            <div className="text-sm">{event.details.userAffected}</div>
            <div className="text-sm font-medium">Perubahan Izin:</div>
            <ul className="list-disc list-inside space-y-1">
              {event.details.permissionChanges.map((change: any, index: number) => (
                <li key={index} className="text-sm">
                  {change.permission}: {change.from ? "Ya" : "Tidak"} → {change.to ? "Ya" : "Tidak"}
                </li>
              ))}
            </ul>
          </div>
        )
      default:
        return <div className="text-sm">Tidak ada detail tambahan</div>
    }
  }

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 gap-1">
            <Info className="h-4 w-4" />
            <span>Detail</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Detail Aktivitas</DialogTitle>
            <DialogDescription>Informasi lengkap tentang aktivitas yang dilakukan</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Informasi Umum</h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm font-medium">Tanggal:</div>
                <div className="text-sm">{format(event.timestamp, "dd MMMM yyyy")}</div>
                <div className="text-sm font-medium">Waktu:</div>
                <div className="text-sm">{format(event.timestamp, "HH:mm:ss")}</div>
                <div className="text-sm font-medium">Pengguna:</div>
                <div className="text-sm">{event.user.name}</div>
                <div className="text-sm font-medium">Email:</div>
                <div className="text-sm">{event.user.email}</div>
                <div className="text-sm font-medium">IP Address:</div>
                <div className="text-sm">{event.ipAddress}</div>
                <div className="text-sm font-medium">User Agent:</div>
                <div className="text-sm truncate max-w-[200px]" title={event.userAgent}>
                  {event.userAgent}
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Detail Aktivitas</h3>
              {renderDetails()}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

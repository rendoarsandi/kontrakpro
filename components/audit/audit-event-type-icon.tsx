import { Archive, Check, Download, Eye, FileEdit, FilePlus, Lock, PenTool, Share2, Sparkles } from "lucide-react"

interface AuditEventTypeIconProps {
  eventType: string
  className?: string
}

export function AuditEventTypeIcon({ eventType, className }: AuditEventTypeIconProps) {
  const getIcon = () => {
    switch (eventType) {
      case "contract_created":
        return <FilePlus className="h-4 w-4 text-green-600" />
      case "contract_updated":
        return <FileEdit className="h-4 w-4 text-blue-600" />
      case "contract_shared":
        return <Share2 className="h-4 w-4 text-purple-600" />
      case "contract_signed":
        return <PenTool className="h-4 w-4 text-emerald-600" />
      case "contract_approved":
        return <Check className="h-4 w-4 text-teal-600" />
      case "contract_viewed":
        return <Eye className="h-4 w-4 text-gray-600" />
      case "ai_analysis_performed":
        return <Sparkles className="h-4 w-4 text-indigo-600" />
      case "contract_exported":
        return <Download className="h-4 w-4 text-amber-600" />
      case "contract_archived":
        return <Archive className="h-4 w-4 text-orange-600" />
      case "permission_changed":
        return <Lock className="h-4 w-4 text-rose-600" />
      default:
        return <FileEdit className="h-4 w-4 text-gray-600" />
    }
  }

  return getIcon()
}

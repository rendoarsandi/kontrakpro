import { Info, Clock, AlertTriangle } from "lucide-react"
import { NotificationType, NotificationPriority } from "@/lib/types/notification"

// Fungsi untuk mendapatkan ikon berdasarkan tipe notifikasi
export function getNotificationIcon(type: string, priority: string) {
  switch (type) {
    case NotificationType.CONTRACT_CREATED:
    case NotificationType.CONTRACT_UPDATED:
    case NotificationType.CONTRACT_DELETED:
      return <Info className={`h-4 w-4 ${priority === NotificationPriority.HIGH ? "text-red-500" : "text-blue-500"}`} />
    case NotificationType.WORKFLOW_CREATED:
    case NotificationType.WORKFLOW_UPDATED:
    case NotificationType.WORKFLOW_STEP_ASSIGNED:
    case NotificationType.WORKFLOW_STEP_COMPLETED:
      return <Clock className={`h-4 w-4 ${priority === NotificationPriority.HIGH ? "text-red-500" : "text-yellow-500"}`} />
    case NotificationType.REMINDER:
      return <AlertTriangle className={`h-4 w-4 ${priority === NotificationPriority.HIGH ? "text-red-500" : "text-orange-500"}`} />
    default:
      return <Info className="h-4 w-4 text-gray-500" />
  }
}

// Fungsi untuk mendapatkan ikon dengan ukuran yang dapat disesuaikan
export function getNotificationIconWithSize(type: string, priority: string, size: number = 4) {
  switch (type) {
    case NotificationType.CONTRACT_CREATED:
    case NotificationType.CONTRACT_UPDATED:
    case NotificationType.CONTRACT_DELETED:
      return <Info className={`h-${size} w-${size} ${priority === NotificationPriority.HIGH ? "text-red-500" : "text-blue-500"}`} />
    case NotificationType.WORKFLOW_CREATED:
    case NotificationType.WORKFLOW_UPDATED:
    case NotificationType.WORKFLOW_STEP_ASSIGNED:
    case NotificationType.WORKFLOW_STEP_COMPLETED:
      return <Clock className={`h-${size} w-${size} ${priority === NotificationPriority.HIGH ? "text-red-500" : "text-yellow-500"}`} />
    case NotificationType.REMINDER:
      return <AlertTriangle className={`h-${size} w-${size} ${priority === NotificationPriority.HIGH ? "text-red-500" : "text-orange-500"}`} />
    default:
      return <Info className={`h-${size} w-${size} text-gray-500`} />
  }
}

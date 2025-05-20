// Tipe notifikasi
export interface Notification {
  id: string
  type: string
  title: string
  message: string
  priority: string
  status: string
  resource_type?: string
  resource_id?: string
  created_at: number
  read_at?: number
}

// Tipe pengingat
export interface Reminder {
  id: string
  title: string
  message: string
  resource_type: string
  resource_id: string
  due_date: number
  status: string
  created_at: number
  completed_at?: number
}

// Enum untuk tipe notifikasi
export enum NotificationType {
  CONTRACT_CREATED = "contract_created",
  CONTRACT_UPDATED = "contract_updated",
  CONTRACT_DELETED = "contract_deleted",
  WORKFLOW_CREATED = "workflow_created",
  WORKFLOW_UPDATED = "workflow_updated",
  WORKFLOW_STEP_ASSIGNED = "workflow_step_assigned",
  WORKFLOW_STEP_COMPLETED = "workflow_step_completed",
  REMINDER = "reminder",
}

// Enum untuk prioritas notifikasi
export enum NotificationPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
}

// Enum untuk status notifikasi
export enum NotificationStatus {
  READ = "read",
  UNREAD = "unread",
}

// Enum untuk status pengingat
export enum ReminderStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

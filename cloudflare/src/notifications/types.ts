// Tipe notifikasi yang didukung
export enum NotificationType {
  CONTRACT_CREATED = 'contract_created',
  CONTRACT_UPDATED = 'contract_updated',
  CONTRACT_DELETED = 'contract_deleted',
  WORKFLOW_CREATED = 'workflow_created',
  WORKFLOW_UPDATED = 'workflow_updated',
  WORKFLOW_STEP_ASSIGNED = 'workflow_step_assigned',
  WORKFLOW_STEP_COMPLETED = 'workflow_step_completed',
  REMINDER = 'reminder',
  SYSTEM = 'system'
}

// Prioritas notifikasi
export enum NotificationPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

// Status notifikasi
export enum NotificationStatus {
  UNREAD = 'unread',
  READ = 'read'
}

// Interface untuk notifikasi
export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  priority: NotificationPriority;
  status: NotificationStatus;
  resource_type?: string;
  resource_id?: string;
  metadata?: Record<string, any>;
  created_at: number;
  read_at?: number;
}

// Interface untuk pengingat
export interface Reminder {
  id: string;
  user_id: string;
  title: string;
  message: string;
  resource_type: string;
  resource_id: string;
  due_date: number;
  status: 'pending' | 'sent' | 'cancelled';
  created_at: number;
  sent_at?: number;
}

import { Env } from '../index';
import { generateId } from '../utils/id';
import { 
  Notification, 
  NotificationType, 
  NotificationPriority, 
  NotificationStatus 
} from './types';

// Layanan untuk mengirim notifikasi
export class NotificationService {
  private env: Env;
  
  constructor(env: Env) {
    this.env = env;
  }
  
  // Mengirim notifikasi ke pengguna
  async sendNotification(
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
    priority: NotificationPriority = NotificationPriority.MEDIUM,
    resourceType?: string,
    resourceId?: string,
    metadata?: Record<string, any>
  ): Promise<Notification> {
    const id = generateId();
    const now = Date.now();
    
    const notification: Notification = {
      id,
      user_id: userId,
      type,
      title,
      message,
      priority,
      status: NotificationStatus.UNREAD,
      resource_type: resourceType,
      resource_id: resourceId,
      metadata,
      created_at: now
    };
    
    // Simpan notifikasi ke database
    await this.env.DB.prepare(
      `INSERT INTO notifications (
        id, user_id, type, title, message, priority, status, 
        resource_type, resource_id, metadata, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      id, 
      userId, 
      type, 
      title, 
      message, 
      priority, 
      NotificationStatus.UNREAD,
      resourceType || null, 
      resourceId || null, 
      metadata ? JSON.stringify(metadata) : null, 
      now
    )
    .run();
    
    return notification;
  }
  
  // Mengirim notifikasi ke beberapa pengguna
  async sendNotificationToUsers(
    userIds: string[],
    type: NotificationType,
    title: string,
    message: string,
    priority: NotificationPriority = NotificationPriority.MEDIUM,
    resourceType?: string,
    resourceId?: string,
    metadata?: Record<string, any>
  ): Promise<Notification[]> {
    const notifications: Notification[] = [];
    
    for (const userId of userIds) {
      const notification = await this.sendNotification(
        userId,
        type,
        title,
        message,
        priority,
        resourceType,
        resourceId,
        metadata
      );
      
      notifications.push(notification);
    }
    
    return notifications;
  }
  
  // Mengirim notifikasi untuk kontrak yang dibuat
  async sendContractCreatedNotification(
    userId: string,
    contractId: string,
    contractTitle: string
  ): Promise<Notification> {
    return this.sendNotification(
      userId,
      NotificationType.CONTRACT_CREATED,
      'Kontrak Baru Dibuat',
      `Kontrak "${contractTitle}" telah dibuat.`,
      NotificationPriority.MEDIUM,
      'contract',
      contractId
    );
  }
  
  // Mengirim notifikasi untuk langkah workflow yang ditugaskan
  async sendWorkflowStepAssignedNotification(
    userId: string,
    workflowId: string,
    contractId: string,
    contractTitle: string,
    stepName: string
  ): Promise<Notification> {
    return this.sendNotification(
      userId,
      NotificationType.WORKFLOW_STEP_ASSIGNED,
      'Tugas Workflow Baru',
      `Anda telah ditugaskan untuk "${stepName}" pada kontrak "${contractTitle}".`,
      NotificationPriority.HIGH,
      'workflow',
      workflowId,
      { contractId }
    );
  }
  
  // Mengirim pengingat
  async sendReminderNotification(
    userId: string,
    reminderId: string,
    title: string,
    message: string,
    resourceType: string,
    resourceId: string
  ): Promise<Notification> {
    return this.sendNotification(
      userId,
      NotificationType.REMINDER,
      title,
      message,
      NotificationPriority.HIGH,
      resourceType,
      resourceId,
      { reminderId }
    );
  }
}

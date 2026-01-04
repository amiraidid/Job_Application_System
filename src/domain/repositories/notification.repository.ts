import { NotificationEntity } from '../entities/notification.entity';

export interface INotificationRepository {
  CreateNotification(
    notification: NotificationEntity,
  ): Promise<NotificationEntity>;
  FindNotificationById(notificationId: string): Promise<NotificationEntity>;
  MarkAsRead(notificationId: string): Promise<NotificationEntity>;
  FetchUserNotifications(userId: string): Promise<NotificationEntity[]>;
}

export const NOTIFICATION_REPO = Symbol('NOTIFICATION_REPO');

import { NotFoundError } from 'src/domain/core/errors/NotFoundError';
import { NotificationEntity } from 'src/domain/entities/notification.entity';
import { INotificationRepository } from 'src/domain/repositories/notification.repository';

export class MarkNotificationAsReadUseCase {
  constructor(private readonly notificationRepo: INotificationRepository) {}

  async execute(notificationId: string): Promise<NotificationEntity> {
    const notification =
      await this.notificationRepo.FindNotificationById(notificationId);
    if (!notification) {
      throw new NotFoundError(
        `Not found any Notification with this ${notificationId}`,
      );
    }

    const updated = await this.notificationRepo.MarkAsRead(notification.id);
    return updated;
  }
}

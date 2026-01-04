import { BadRequestError } from 'src/domain/core/errors/BadRequestError';
import { NotFoundError } from 'src/domain/core/errors/NotFoundError';
import { NotificationEntity } from 'src/domain/entities/notification.entity';
import { INotificationRepository } from 'src/domain/repositories/notification.repository';

export class FindNotificationByIdUseCase {
  constructor(private readonly notificationRepo: INotificationRepository) {}

  async execute(ntfId: string): Promise<NotificationEntity> {
    if (!ntfId) {
      throw new BadRequestError(`Provide the Notification id`);
    }

    const notification =
      await this.notificationRepo.FindNotificationById(ntfId);
    if (!notification) {
      throw new NotFoundError(`Not Found any Notification with this ${ntfId}`);
    }

    return notification;
  }
}

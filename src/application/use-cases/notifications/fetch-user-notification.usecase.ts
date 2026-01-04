import { BadRequestError } from 'src/domain/core/errors/BadRequestError';
import { NotFoundError } from 'src/domain/core/errors/NotFoundError';
import { NotificationEntity } from 'src/domain/entities/notification.entity';
import { INotificationRepository } from 'src/domain/repositories/notification.repository';
import { IUserRepository } from 'src/domain/repositories/user.repository';

export class FetchUserNotificationsUseCase {
  constructor(
    private readonly notificationRepo: INotificationRepository,
    private readonly userRepo: IUserRepository,
  ) {}

  async execute(userId: string): Promise<NotificationEntity[]> {
    if (!userId) {
      throw new BadRequestError(`Error has occurred!`);
    }

    const user = await this.userRepo.FindUserById(userId);
    if (!user) {
      throw new NotFoundError(`Not Found any User with this ${userId}`);
    }

    const notifications = await this.notificationRepo.FetchUserNotifications(
      user.id,
    );
    if (notifications.length <= 0) {
      throw new NotFoundError(`Not found any Notifications`);
    }

    return notifications;
  }
}

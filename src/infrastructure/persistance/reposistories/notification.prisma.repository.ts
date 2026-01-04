import { Injectable } from '@nestjs/common';
import { ConflictError } from 'src/domain/core/errors/ConflictError';
import { NotificationEntity } from 'src/domain/entities/notification.entity';
import { INotificationRepository } from 'src/domain/repositories/notification.repository';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { NotificationPersistenceMapper } from '../mappers/notification.mapper';
import { NotFoundError } from 'src/domain/core/errors/NotFoundError';

@Injectable()
export class NotificationPrismaRepository implements INotificationRepository {
  constructor(private readonly prisma: PrismaService) {}
  async CreateNotification(
    notification: NotificationEntity,
  ): Promise<NotificationEntity> {
    const ntfy = await this.prisma.notification.create({
      data: {
        title: notification.title,
        message: notification.message,
        type: notification.type,
        userId: notification.userId,
        companyId: notification.companyId,
      },
    });

    if (!ntfy) {
      throw new ConflictError('Failed to create this notification');
    }
    return NotificationPersistenceMapper.toDomain(ntfy);
  }

  async FindNotificationById(
    notificationId: string,
  ): Promise<NotificationEntity> {
    const notification = await this.prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification) {
      throw new NotFoundError(
        `Not Found any Notification with this ${notificationId}`,
      );
    }

    return NotificationPersistenceMapper.toDomain(notification);
  }

  async FetchUserNotifications(userId: string): Promise<NotificationEntity[]> {
    const notifications = await this.prisma.notification.findMany({
      where: { userId: userId },
    });

    if (!notifications || notifications.length <= 0) {
      throw new NotFoundError('Not Found any notifications');
    }

    return NotificationPersistenceMapper.toDomainArray(notifications);
  }

  async MarkAsRead(notificationId: string): Promise<NotificationEntity> {
    const notification = await this.prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });

    if (!notification) {
      throw new NotFoundError(
        `Not found any Notification with this ${notificationId}`,
      );
    }

    return NotificationPersistenceMapper.toDomain(notification);
  }
}

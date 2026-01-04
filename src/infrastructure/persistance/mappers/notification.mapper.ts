import { NotificationEntity } from 'src/domain/entities/notification.entity';

interface NotificationRaw {
  id: string;
  title: string;
  message: string;
  type: string;
  userId: string;
  companyId: string;
  isRead: boolean;
  createdAt: Date;
}

export class NotificationPersistenceMapper {
  static toDomain(raw: NotificationRaw): NotificationEntity {
    const notification = new NotificationEntity(
      raw.title,
      raw.message,
      raw.type,
      raw.userId,
      raw.companyId,
    );

    (notification.id as any) = raw.id;
    (notification.isRead as any) = raw.isRead;
    (notification.createdAt as any) = raw.createdAt;
    return notification;
  }

  static toPersistence(notification: NotificationEntity) {
    return {
      id: notification.id,
      title: notification.title,
      message: notification.message,
      type: notification.type,
      userId: notification.userId,
      companyId: notification.companyId,
      isRead: notification.isRead,
      createdAt: notification.createdAt,
    };
  }

  static toDomainArray(raws: NotificationRaw[]): NotificationEntity[] {
    return raws.map((raw) => NotificationPersistenceMapper.toDomain(raw));
  }

  static toPersistenceArray(entities: NotificationEntity[]) {
    return entities.map((entity) =>
      NotificationPersistenceMapper.toPersistence(entity),
    );
  }
}

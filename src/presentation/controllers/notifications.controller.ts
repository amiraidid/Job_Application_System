import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CreateNotificationUseCase } from 'src/application/use-cases/notifications/create-notification.usecase';
import { NotificationPersistenceMapper } from 'src/infrastructure/persistance/mappers/notification.mapper';
import { CreateNotificationHttpDto } from '../dtos/notifications/create-notifications.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { FindNotificationByIdUseCase } from 'src/application/use-cases/notifications/find-notification-byId.usecase';
import { FetchUserNotificationsUseCase } from 'src/application/use-cases/notifications/fetch-user-notification.usecase';
import { GetProfile } from '../auth/decorators/get-profile.decorator';
import { MarkNotificationAsReadUseCase } from 'src/application/use-cases/notifications/mark-as-read.usecase';

@Controller('api/v1/notifications')
export class NotificationController {
  constructor(
    private readonly createNotification: CreateNotificationUseCase,
    private readonly findNotification: FindNotificationByIdUseCase,
    private readonly userNotifications: FetchUserNotificationsUseCase,
    private readonly markAsRead: MarkNotificationAsReadUseCase,
  ) {}

  @Post()
  @UseGuards(JwtGuard)
  async create(@Body() dto: CreateNotificationHttpDto) {
    const res = await this.createNotification.execute(dto);
    return NotificationPersistenceMapper.toPersistence(res);
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  async findById(@Param('id') id: string) {
    const res = await this.findNotification.execute(id);
    return NotificationPersistenceMapper.toPersistence(res);
  }

  @Get()
  @UseGuards(JwtGuard)
  async fetchUserNotifications(@GetProfile('sub') userId: string) {
    const res = await this.userNotifications.execute(userId);
    return NotificationPersistenceMapper.toPersistenceArray(res);
  }

  @Put(':id')
  @UseGuards(JwtGuard)
  async updateNotification(@Param('id') id: string) {
    const res = await this.markAsRead.execute(id);
    return NotificationPersistenceMapper.toPersistence(res);
  }
}

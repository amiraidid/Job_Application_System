import { CreateNotificationAppDto } from 'src/application/dtos/notifications/create-notification.dto';
import { NotFoundError } from 'src/domain/core/errors/NotFoundError';
import { ValidationError } from 'src/domain/core/errors/ValidationError';
import { BadRequestError } from 'src/domain/core/errors/BadRequestError';
import { NotificationEntity } from 'src/domain/entities/notification.entity';
import { ICompanyRepository } from 'src/domain/repositories/company.repository';
import { INotificationRepository } from 'src/domain/repositories/notification.repository';
import { IUserRepository } from 'src/domain/repositories/user.repository';

export class CreateNotificationUseCase {
  constructor(
    private readonly notificationRepo: INotificationRepository,
    private readonly userRepo: IUserRepository,
    private readonly companyRepo: ICompanyRepository,
  ) {}

  async execute(dto: CreateNotificationAppDto): Promise<NotificationEntity> {
    if (
      !dto.userId ||
      !dto.companyId ||
      !dto.message ||
      !dto.title ||
      !dto.type
    ) {
      throw new BadRequestError('Fill all the fields, and try again');
    }

    const user = await this.userRepo.FindUserById(dto.userId);
    if (!user) {
      throw new NotFoundError(`Not Found any User with this ${dto.userId}`);
    }

    const company = await this.companyRepo.GetCompanyById(dto.companyId);
    if (!company) {
      throw new NotFoundError(
        `Not Found any company with this ${dto.companyId}`,
      );
    }

    const newNtfy = new NotificationEntity(
      dto.title,
      dto.message,
      dto.type,
      user.id,
      company.id,
    );
    if (!newNtfy.isValid()) {
      throw new ValidationError('Inserted data isn`t valid, please try again');
    }

    return await this.notificationRepo.CreateNotification(newNtfy);
  }
}

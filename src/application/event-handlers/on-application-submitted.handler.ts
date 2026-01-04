import { Inject, Injectable } from '@nestjs/common';
import { CreateNotificationUseCase } from '../use-cases/notifications/create-notification.usecase';
import { OnEvent } from '@nestjs/event-emitter';
import { ApplicationSubmittedEvent } from 'src/domain/events/application-submitted.event';
import { NotFoundError } from 'src/domain/core/errors/NotFoundError';
import { ICOMPANY_REPO } from 'src/domain/repositories/company.repository';
import type { ICompanyRepository } from 'src/domain/repositories/company.repository';

@Injectable()
export class OnApplicationSubmittedHandler {
  constructor(
    private readonly createNotification: CreateNotificationUseCase,
    @Inject(ICOMPANY_REPO)
    private readonly companyRepo: ICompanyRepository,
  ) {}

  @OnEvent('ApplicationSubmittedEvent')
  async handle(event: ApplicationSubmittedEvent) {
    const company = await this.companyRepo.GetCompanyById(event.tenantId);
    if (!company) {
      throw new NotFoundError(
        `Not Found any Company with this ${event.tenantId}`,
      );
    }

    const company_users = company.companyUsers.filter((u) => {
      return u.role == 'HR';
    });
    for (const user of company_users) {
      await this.createNotification.execute({
        companyId: event.tenantId,
        userId: user.userId,
        title: 'New Job Application',
        message: 'A new application has been submitted.',
        type: 'APPLICATION_SUBMITTED',
      });
    }
  }
}

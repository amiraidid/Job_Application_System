import { Inject, Injectable } from '@nestjs/common';
import { APPLICATION_REPO } from 'src/domain/repositories/application.repository';
import type { IApplicationRepository } from 'src/domain/repositories/application.repository';
import { OnEvent } from '@nestjs/event-emitter';
import { ApplicationStatusChangedEvent } from 'src/domain/events/application-status-changed.event';
import { NotFoundError } from 'src/domain/core/errors/NotFoundError';
import { CreateNotificationUseCase } from '../use-cases/notifications/create-notification.usecase';

@Injectable()
export class onApplicationStatusChangedHandler {
  constructor(
    private readonly createNotification: CreateNotificationUseCase,
    @Inject(APPLICATION_REPO)
    private readonly ApplicationRepo: IApplicationRepository,
  ) {}

  @OnEvent('ApplicationStatusChangedEvent')
  async handle(event: ApplicationStatusChangedEvent) {
    const application = await this.ApplicationRepo.FindApplicationById(
      event.applicationId,
    );
    if (!application) {
      throw new NotFoundError(
        `Not found any Application with this ${event.applicationId}`,
      );
    }

    await this.createNotification.execute({
      companyId: application.companyId,
      userId: application.userId,
      title: 'Updated Application Status',
      message: 'The Applications`s status has been changed',
      type: 'APPLICATION_UPDATED',
    });
  }
}

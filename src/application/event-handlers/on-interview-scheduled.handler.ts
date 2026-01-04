import { Inject, Injectable } from '@nestjs/common';
import { CreateNotificationUseCase } from '../use-cases/notifications/create-notification.usecase';
import type { INterviewRepository } from 'src/domain/repositories/interview.repository';
import { OnEvent } from '@nestjs/event-emitter';
import { InterviewScheduledEvent } from 'src/domain/events/interview-scheduled.event';
import { NotFoundError } from 'src/domain/core/errors/NotFoundError';
import { INTERVIEW_REPO } from 'src/domain/repositories/interview.repository';

@Injectable()
export class onInterviewScheduledHandler {
  constructor(
    private readonly createNotification: CreateNotificationUseCase,
    @Inject(INTERVIEW_REPO)
    private readonly interveiwRepo: INterviewRepository,
  ) {}

  @OnEvent('InterviewScheduledEvent')
  async handle(event: InterviewScheduledEvent) {
    const interview = await this.interveiwRepo.FindInterviewById(
      event.interviewId,
    );
    if (!interview) {
      throw new NotFoundError(
        `Not found any Interview with this ${event.interviewId}`,
      );
    }

    const users = [event.interviewerId, event.candidateId];
    for (const usr of users) {
      await this.createNotification.execute({
        companyId: interview.companyId,
        userId: usr,
        title: 'Interveiw Scheduled',
        message: 'An Interview has been scheduled for your application',
        type: 'INTERVIEW_SCHEDULED',
      });
    }
  }
}

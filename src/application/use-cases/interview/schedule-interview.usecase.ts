import { ScheduleInterviewUseCaseDto } from 'src/application/dtos/interview-dtos/schedule-interview.dto';
import { ForbiddenError } from 'src/domain/core/errors/ForbiddenError';
import { NotFoundError } from 'src/domain/core/errors/NotFoundError';
import { ValidationError } from 'src/domain/core/errors/ValidationError';
import { InterviewEntity } from 'src/domain/entities/interview.entity';
import { InterviewScheduledEvent } from 'src/domain/events/interview-scheduled.event';
import { IApplicationRepository } from 'src/domain/repositories/application.repository';
import { ICompanyRepository } from 'src/domain/repositories/company.repository';
import { INterviewRepository } from 'src/domain/repositories/interview.repository';
import { IUserRepository } from 'src/domain/repositories/user.repository';
import { IEventBus } from 'src/domain/services/event-bus.intetface';

export class ScheduleInterviewUseCase {
  constructor(
    private readonly interviewRepo: INterviewRepository,
    private readonly companyRepo: ICompanyRepository,
    private readonly applicationRepo: IApplicationRepository,
    private readonly userRepo: IUserRepository,
    private readonly eventBus: IEventBus,
  ) {}

  async execute(
    dto: ScheduleInterviewUseCaseDto,
    companyId: string,
  ): Promise<InterviewEntity> {
    const company = await this.companyRepo.GetCompanyById(companyId);
    if (!company) {
      throw new Error(`Not found any company with this ${companyId}`);
    }

    const application = await this.applicationRepo.FindApplicationById(
      dto.applicationId,
    );
    if (!application) {
      throw new NotFoundError(
        `Not found any application with this ${dto.applicationId}`,
      );
    }

    const user = await this.userRepo.FindUserById(dto.interviewerId);
    if (!user) {
      throw new NotFoundError(
        `Not found any User with this ${dto.interviewerId}`,
      );
    }

    const co_user = user?.companyUsers?.find((usr) => {
      return usr.companyId == company.id && usr.role == 'INTERVIEWER';
    });
    if (company.id !== co_user?.companyId) {
      throw new ForbiddenError(
        'Sorry, you don`t have the permissions to perform this action',
      );
    }

    if (application.companyId !== company.id) {
      throw new ForbiddenError(
        `Sorry! this application doesnt related to this company`,
      );
    }

    const interview = new InterviewEntity(
      user.id,
      dto.time,
      application.id,
      dto.feedback,
      company.id,
    );

    if (!interview.isValid()) {
      throw new ValidationError("Your Inserted Data isn't valid.");
    }
    const schedule = await this.interviewRepo.ScheduleInterview(interview);
    if (!schedule) {
      throw new NotFoundError('Failed to Schedule an interview');
    }

    this.eventBus.publish(
      new InterviewScheduledEvent(
        schedule.interviewerId,
        application.userId,
        schedule.id,
      ),
    );

    return schedule;
  }
}

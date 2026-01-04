import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma.module';
import { InterviewControllers } from '../controllers/interview.controller';
import {
  INTERVIEW_REPO,
  INterviewRepository,
} from 'src/domain/repositories/interview.repository';
import { InterviewPrismaRepository } from 'src/infrastructure/persistance/reposistories/interview.prisma.repository';
import { ScheduleInterviewUseCase } from 'src/application/use-cases/interview/schedule-interview.usecase';
import { FindInterviewByIdUseCase } from 'src/application/use-cases/interview/find-interview.usecase';
import { UpdateInterviewFeedbackUseCase } from 'src/application/use-cases/interview/update-interview-feedback.usecase';
import { RemoveInterviewUseCase } from 'src/application/use-cases/interview/remove-interview.usecase';
import {
  ICOMPANY_REPO,
  ICompanyRepository,
} from 'src/domain/repositories/company.repository';
import { CompanyPrismaRepository } from 'src/infrastructure/persistance/reposistories/company.prisma.repository';
import {
  IUserRepository,
  USER_REPOSITORY,
} from 'src/domain/repositories/user.repository';
import { UserPrismaRepository } from 'src/infrastructure/persistance/reposistories/user.prisma.repository';
import {
  APPLICATION_REPO,
  IApplicationRepository,
} from 'src/domain/repositories/application.repository';
import { applicationJobPrismaRepository } from 'src/infrastructure/persistance/reposistories/application-job.prisma.repository';
import {
  IEVENT_REPO,
  IEventBus,
} from 'src/domain/services/event-bus.intetface';
import { NestEventBus } from 'src/infrastructure/events/nest-event-bus';

@Module({
  imports: [PrismaModule],
  controllers: [InterviewControllers],
  providers: [
    {
      provide: INTERVIEW_REPO,
      useClass: InterviewPrismaRepository,
    },
    {
      provide: ICOMPANY_REPO,
      useClass: CompanyPrismaRepository,
    },
    {
      provide: USER_REPOSITORY,
      useClass: UserPrismaRepository,
    },
    {
      provide: APPLICATION_REPO,
      useClass: applicationJobPrismaRepository,
    },
    {
      provide: IEVENT_REPO,
      useClass: NestEventBus,
    },
    {
      provide: ScheduleInterviewUseCase,
      useFactory: (
        repo: INterviewRepository,
        companyRepo: ICompanyRepository,
        applicationRepo: IApplicationRepository,
        userRepo: IUserRepository,
        eventRepo: IEventBus,
      ) =>
        new ScheduleInterviewUseCase(
          repo,
          companyRepo,
          applicationRepo,
          userRepo,
          eventRepo,
        ),
      inject: [
        INTERVIEW_REPO,
        ICOMPANY_REPO,
        APPLICATION_REPO,
        USER_REPOSITORY,
        IEVENT_REPO,
      ],
    },
    {
      provide: FindInterviewByIdUseCase,
      useFactory: (
        repo: INterviewRepository,
        companyRepo: ICompanyRepository,
        applicationRepo: IApplicationRepository,
      ) => new FindInterviewByIdUseCase(repo, companyRepo, applicationRepo),
      inject: [INTERVIEW_REPO, ICOMPANY_REPO, APPLICATION_REPO],
    },
    {
      provide: UpdateInterviewFeedbackUseCase,
      useFactory: (
        repo: INterviewRepository,
        companyRepo: ICompanyRepository,
        userRepo: IUserRepository,
      ) => new UpdateInterviewFeedbackUseCase(repo, companyRepo, userRepo),
      inject: [INTERVIEW_REPO, ICOMPANY_REPO, USER_REPOSITORY],
    },
    {
      provide: RemoveInterviewUseCase,
      useFactory: (
        repo: INterviewRepository,
        companyRepo: ICompanyRepository,
        userRepo: IUserRepository,
      ) => new RemoveInterviewUseCase(repo, companyRepo, userRepo),
      inject: [INTERVIEW_REPO, ICOMPANY_REPO, USER_REPOSITORY],
    },
  ],
  exports: [],
})
export class InterviewModule {}

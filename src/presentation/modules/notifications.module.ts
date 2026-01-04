import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma.module';
import { NotificationController } from '../controllers/notifications.controller';
import {
  INotificationRepository,
  NOTIFICATION_REPO,
} from 'src/domain/repositories/notification.repository';
import { NotificationPrismaRepository } from 'src/infrastructure/persistance/reposistories/notification.prisma.repository';
import { CreateNotificationUseCase } from 'src/application/use-cases/notifications/create-notification.usecase';
import {
  IUserRepository,
  USER_REPOSITORY,
} from 'src/domain/repositories/user.repository';
import { UserPrismaRepository } from 'src/infrastructure/persistance/reposistories/user.prisma.repository';
import {
  ICOMPANY_REPO,
  ICompanyRepository,
} from 'src/domain/repositories/company.repository';
import { CompanyPrismaRepository } from 'src/infrastructure/persistance/reposistories/company.prisma.repository';
import { FindNotificationByIdUseCase } from 'src/application/use-cases/notifications/find-notification-byId.usecase';
import { FetchUserNotificationsUseCase } from 'src/application/use-cases/notifications/fetch-user-notification.usecase';
import { MarkNotificationAsReadUseCase } from 'src/application/use-cases/notifications/mark-as-read.usecase';
import { OnApplicationSubmittedHandler } from 'src/application/event-handlers/on-application-submitted.handler';
import { onApplicationStatusChangedHandler } from 'src/application/event-handlers/on-application-status-changed.handler';
import { APPLICATION_REPO } from 'src/domain/repositories/application.repository';
import { applicationJobPrismaRepository } from 'src/infrastructure/persistance/reposistories/application-job.prisma.repository';
import { INTERVIEW_REPO } from 'src/domain/repositories/interview.repository';
import { InterviewPrismaRepository } from 'src/infrastructure/persistance/reposistories/interview.prisma.repository';
import { onInterviewScheduledHandler } from 'src/application/event-handlers/on-interview-scheduled.handler';
import { onCommentAddedHandler } from 'src/application/event-handlers/on-comment-added.handler';
import { ICOMMENT_REPO } from 'src/domain/repositories/comment.repository';
import { CommentPrismaRepository } from 'src/infrastructure/persistance/reposistories/comment.prisma.repository';

@Module({
  imports: [PrismaModule],
  controllers: [NotificationController],
  providers: [
    OnApplicationSubmittedHandler,
    onApplicationStatusChangedHandler,
    onInterviewScheduledHandler,
    onCommentAddedHandler,

    {
      provide: NOTIFICATION_REPO,
      useClass: NotificationPrismaRepository,
    },
    {
      provide: USER_REPOSITORY,
      useClass: UserPrismaRepository,
    },
    {
      provide: ICOMPANY_REPO,
      useClass: CompanyPrismaRepository,
    },
    {
      provide: APPLICATION_REPO,
      useClass: applicationJobPrismaRepository,
    },
    {
      provide: INTERVIEW_REPO,
      useClass: InterviewPrismaRepository,
    },
    {
      provide: ICOMMENT_REPO,
      useClass: CommentPrismaRepository,
    },
    {
      provide: CreateNotificationUseCase,
      useFactory: (
        repo: INotificationRepository,
        userRepo: IUserRepository,
        companyRepo: ICompanyRepository,
      ) => new CreateNotificationUseCase(repo, userRepo, companyRepo),
      inject: [NOTIFICATION_REPO, USER_REPOSITORY, ICOMPANY_REPO],
    },
    {
      provide: FindNotificationByIdUseCase,
      useFactory: (repo: INotificationRepository) =>
        new FindNotificationByIdUseCase(repo),
      inject: [NOTIFICATION_REPO],
    },
    {
      provide: FetchUserNotificationsUseCase,
      useFactory: (repo: INotificationRepository, userRepo: IUserRepository) =>
        new FetchUserNotificationsUseCase(repo, userRepo),
      inject: [NOTIFICATION_REPO, USER_REPOSITORY],
    },
    {
      provide: MarkNotificationAsReadUseCase,
      useFactory: (repo: INotificationRepository) =>
        new MarkNotificationAsReadUseCase(repo),
      inject: [NOTIFICATION_REPO],
    },
  ],
})
export class NotificationModule {}

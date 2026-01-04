import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma.module';
import { CommentController } from '../controllers/comment.controller';
import { CommentPrismaRepository } from 'src/infrastructure/persistance/reposistories/comment.prisma.repository';
import {
  ICOMMENT_REPO,
  ICommentRepository,
} from 'src/domain/repositories/comment.repository';
import { AddCommentUseCase } from 'src/application/use-cases/comments/add-comment.usecase';
import {
  IUserRepository,
  USER_REPOSITORY,
} from 'src/domain/repositories/user.repository';
import {
  APPLICATION_REPO,
  IApplicationRepository,
} from 'src/domain/repositories/application.repository';
import { applicationJobPrismaRepository } from 'src/infrastructure/persistance/reposistories/application-job.prisma.repository';
import { UserPrismaRepository } from 'src/infrastructure/persistance/reposistories/user.prisma.repository';
import { GetCommentByIdUseCase } from 'src/application/use-cases/comments/get-comment-byId.usecase';
import { GetApplicationCommentsUseCase } from 'src/application/use-cases/comments/get-application-comments.usecase';
import {
  ICOMPANY_REPO,
  ICompanyRepository,
} from 'src/domain/repositories/company.repository';
import { CompanyPrismaRepository } from 'src/infrastructure/persistance/reposistories/company.prisma.repository';
import { RemoveCommentUseCase } from 'src/application/use-cases/comments/remove-comment.usecase';
import {
  IEVENT_REPO,
  IEventBus,
} from 'src/domain/services/event-bus.intetface';
import { NestEventBus } from 'src/infrastructure/events/nest-event-bus';

@Module({
  imports: [PrismaModule],
  controllers: [CommentController],
  providers: [
    {
      provide: ICOMMENT_REPO,
      useClass: CommentPrismaRepository,
    },
    {
      provide: APPLICATION_REPO,
      useClass: applicationJobPrismaRepository,
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
      provide: IEVENT_REPO,
      useClass: NestEventBus,
    },
    {
      provide: AddCommentUseCase,
      useFactory: (
        repo: ICommentRepository,
        appRepo: IApplicationRepository,
        userRepo: IUserRepository,
        companyRepo: ICompanyRepository,
        eventRepo: IEventBus,
      ) =>
        new AddCommentUseCase(repo, appRepo, userRepo, companyRepo, eventRepo),
      inject: [
        ICOMMENT_REPO,
        APPLICATION_REPO,
        USER_REPOSITORY,
        ICOMPANY_REPO,
        IEVENT_REPO,
      ],
    },
    {
      provide: GetCommentByIdUseCase,
      useFactory: (
        repo: ICommentRepository,
        appRepo: IApplicationRepository,
        userRepo: IUserRepository,
        companyRepo: ICompanyRepository,
      ) => new GetCommentByIdUseCase(repo, appRepo, userRepo, companyRepo),
      inject: [ICOMMENT_REPO, APPLICATION_REPO, USER_REPOSITORY, ICOMPANY_REPO],
    },
    {
      provide: GetApplicationCommentsUseCase,
      useFactory: (
        repo: ICommentRepository,
        appRepo: IApplicationRepository,
        userRepo: IUserRepository,
        companyRepo: ICompanyRepository,
      ) =>
        new GetApplicationCommentsUseCase(repo, appRepo, companyRepo, userRepo),
      inject: [ICOMMENT_REPO, APPLICATION_REPO, USER_REPOSITORY, ICOMPANY_REPO],
    },
    {
      provide: RemoveCommentUseCase,
      useFactory: (
        repo: ICommentRepository,
        userRepo: IUserRepository,
        companyRepo: ICompanyRepository,
      ) => new RemoveCommentUseCase(repo, companyRepo, userRepo),
      inject: [ICOMMENT_REPO, USER_REPOSITORY, ICOMPANY_REPO],
    },
  ],
})
export class CommentModule {}

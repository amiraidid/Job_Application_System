/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma.module';
import { ApplicationJobController } from '../controllers/application-job.controller';
import { ApplyToJobUseCase } from 'src/application/use-cases/application-job/apply-to-job.usecase';
import {
  APPLICATION_REPO,
  IApplicationRepository,
} from 'src/domain/repositories/application.repository';
import { applicationJobPrismaRepository } from 'src/infrastructure/persistance/reposistories/application-job.prisma.repository';
import { FindApplicationByIdUseCase } from 'src/application/use-cases/application-job/find-application-byId.usecase';
import { UpdateApplicationStatusUseCase } from 'src/application/use-cases/application-job/update-application-status.usecase';
import { CloudinaryModule } from 'src/infrastructure/services/file-storage/cloudinary.module';
import { CloudinaryService } from 'src/infrastructure/services/file-storage/cloudinary.service';
import { UploadResumeUseCase } from 'src/application/use-cases/application-job/upload-resume.usecase';
import { MulterModule } from '@nestjs/platform-express';
import multer from 'multer';
import { IFileStorageService } from 'src/domain/services/IFileStorageService';
import { RemoveApplicationUseCase } from 'src/application/use-cases/application-job/remove-application.usecase';
import { RemoveResumeUseCase } from 'src/application/use-cases/application-job/remove-resume.usecase';
import { GetApplicationsForJobUseCase } from 'src/application/use-cases/application-job/get-applications-for-job.usecase';
import {
  ICOMPANY_REPO,
  ICompanyRepository,
} from 'src/domain/repositories/company.repository';
import {
  IUserRepository,
  USER_REPOSITORY,
} from 'src/domain/repositories/user.repository';
import { UserPrismaRepository } from 'src/infrastructure/persistance/reposistories/user.prisma.repository';
import { CompanyPrismaRepository } from 'src/infrastructure/persistance/reposistories/company.prisma.repository';
import {
  IEventBus,
  IEVENT_REPO,
} from 'src/domain/services/event-bus.intetface';
import { NestEventBus } from 'src/infrastructure/events/nest-event-bus';

@Module({
  imports: [
    PrismaModule,
    CloudinaryModule,
    MulterModule.register({
      storage: multer.memoryStorage(),
    }),
  ],
  controllers: [ApplicationJobController],
  providers: [
    // CloudinaryService,
    {
      provide: UploadResumeUseCase,
      useFactory: (repo) => new UploadResumeUseCase(repo),
      inject: [IFileStorageService],
    },
    {
      provide: RemoveResumeUseCase,
      useFactory: (repo) => new RemoveResumeUseCase(repo),
      inject: [IFileStorageService],
    },
    {
      provide: IFileStorageService,
      useClass: CloudinaryService,
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
      provide: IEVENT_REPO,
      useClass: NestEventBus,
    },

    {
      provide: ApplyToJobUseCase,
      useFactory: (
        repo: IApplicationRepository,
        companyRepo: ICompanyRepository,
        uploadResume: UploadResumeUseCase,
        userRepo: IUserRepository,
        eventRepo: IEventBus,
      ) =>
        new ApplyToJobUseCase(
          repo,
          companyRepo,
          uploadResume,
          userRepo,
          eventRepo,
        ),
      inject: [
        APPLICATION_REPO,
        ICOMPANY_REPO,
        UploadResumeUseCase,
        USER_REPOSITORY,
        IEVENT_REPO,
      ],
    },

    {
      provide: FindApplicationByIdUseCase,
      useFactory: (
        repo: IApplicationRepository,
        companyRepo: ICompanyRepository,
        userRepo: IUserRepository,
      ) => new FindApplicationByIdUseCase(repo, companyRepo, userRepo),
      inject: [APPLICATION_REPO, ICOMPANY_REPO, USER_REPOSITORY],
    },

    {
      provide: UpdateApplicationStatusUseCase,
      useFactory: (
        repo: IApplicationRepository,
        companyRepo: ICompanyRepository,
        userRepo: IUserRepository,
        eventRepo: IEventBus,
      ) =>
        new UpdateApplicationStatusUseCase(
          repo,
          companyRepo,
          userRepo,
          eventRepo,
        ),
      inject: [APPLICATION_REPO, ICOMPANY_REPO, USER_REPOSITORY, IEVENT_REPO],
    },

    {
      provide: RemoveApplicationUseCase,
      useFactory: (
        repo: IApplicationRepository,
        removeResume: RemoveResumeUseCase,
        companyRepo: ICompanyRepository,
        userRepo: IUserRepository,
      ) =>
        new RemoveApplicationUseCase(repo, removeResume, companyRepo, userRepo),
      inject: [
        APPLICATION_REPO,
        RemoveResumeUseCase,
        ICOMPANY_REPO,
        USER_REPOSITORY,
      ],
    },

    {
      provide: GetApplicationsForJobUseCase,
      useFactory: (
        repo: IApplicationRepository,
        companyRepo: ICompanyRepository,
        userRepo: IUserRepository,
      ) => new GetApplicationsForJobUseCase(repo, companyRepo, userRepo),
      inject: [APPLICATION_REPO, ICOMPANY_REPO, USER_REPOSITORY],
    },
  ],
  exports: [],
})
export class ApplicationJobModule {}

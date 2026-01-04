import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma.module';
import { CreateJobPostUseCase } from 'src/application/use-cases/job-post/create-job-post.usecase';
import { JobPostController } from '../controllers/job-post.controller';
import {
  IJobPostRepository,
  JOB_REPOSITRY,
} from 'src/domain/repositories/job-post.repository';
import { JobPostPrimsaRepository } from 'src/infrastructure/persistance/reposistories/job-post.prisma.repository';
import { UpdateJobPostUseCase } from 'src/application/use-cases/job-post/update-job-post.usecase';
import { PublishJobPostUseCase } from 'src/application/use-cases/job-post/publish-job-post.usecase';
import { UnPublishJobPostUseCase } from 'src/application/use-cases/job-post/unpublish-job-post.usecase';
import { RemoveJobPostUseCase } from 'src/application/use-cases/job-post/remove-job-post.usecase';
import { FetchJobPostsUseCase } from 'src/application/use-cases/job-post/fetch-job-posts.usecase';
import {
  ICOMPANY_REPO,
  ICompanyRepository,
} from 'src/domain/repositories/company.repository';
import { CompanyPrismaRepository } from 'src/infrastructure/persistance/reposistories/company.prisma.repository';
import { FindByIdPostUseCase } from 'src/application/use-cases/job-post/find-job-byId.usecase';
import {
  IUserRepository,
  USER_REPOSITORY,
} from 'src/domain/repositories/user.repository';
import { UserPrismaRepository } from 'src/infrastructure/persistance/reposistories/user.prisma.repository';

@Module({
  imports: [PrismaModule],
  controllers: [JobPostController],
  providers: [
    {
      provide: JOB_REPOSITRY,
      useClass: JobPostPrimsaRepository,
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
      provide: CreateJobPostUseCase,
      useFactory: (
        repo: IJobPostRepository,
        companyRepo: ICompanyRepository,
        userRepo: IUserRepository,
      ) => new CreateJobPostUseCase(repo, companyRepo, userRepo),
      inject: [JOB_REPOSITRY, ICOMPANY_REPO, USER_REPOSITORY],
    },
    {
      provide: UpdateJobPostUseCase,
      useFactory: (
        repo: IJobPostRepository,
        companyRepo: ICompanyRepository,
        userRepo: IUserRepository,
      ) => new UpdateJobPostUseCase(repo, companyRepo, userRepo),
      inject: [JOB_REPOSITRY, ICOMPANY_REPO, USER_REPOSITORY],
    },
    {
      provide: PublishJobPostUseCase,
      useFactory: (
        repo: IJobPostRepository,
        companyRepo: ICompanyRepository,
        userRepo: IUserRepository,
      ) => new PublishJobPostUseCase(repo, companyRepo, userRepo),
      inject: [JOB_REPOSITRY, ICOMPANY_REPO, USER_REPOSITORY],
    },
    {
      provide: UnPublishJobPostUseCase,
      useFactory: (
        repo: IJobPostRepository,
        companyRepo: ICompanyRepository,
        userRepo: IUserRepository,
      ) => new UnPublishJobPostUseCase(repo, companyRepo, userRepo),
      inject: [JOB_REPOSITRY, ICOMPANY_REPO, USER_REPOSITORY],
    },
    {
      provide: RemoveJobPostUseCase,
      useFactory: (
        repo: IJobPostRepository,
        companyRepo: ICompanyRepository,
        userRepo: IUserRepository,
      ) => new RemoveJobPostUseCase(repo, companyRepo, userRepo),
      inject: [JOB_REPOSITRY, ICOMPANY_REPO, USER_REPOSITORY],
    },
    {
      provide: FetchJobPostsUseCase,
      useFactory: (repo: IJobPostRepository, companyRepo: ICompanyRepository) =>
        new FetchJobPostsUseCase(repo, companyRepo),
      inject: [JOB_REPOSITRY, ICOMPANY_REPO],
    },
    {
      provide: FindByIdPostUseCase,
      useFactory: (repo: IJobPostRepository, companyRepo: ICompanyRepository) =>
        new FindByIdPostUseCase(repo, companyRepo),
      inject: [JOB_REPOSITRY, ICOMPANY_REPO],
    },
  ],
  exports: [],
})
export class JobPostModule {}

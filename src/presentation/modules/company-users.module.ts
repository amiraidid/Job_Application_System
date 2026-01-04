import { Module } from '@nestjs/common';
import { CompanyUsersController } from '../controllers/company-user.controller';
import { PrismaModule } from './prisma.module';
import {
  ICOMPANYUSER_REPO,
  ICompanyUsersRepository,
} from 'src/domain/repositories/company-users.repository';
import { CompanyUserPrismaRepository } from 'src/infrastructure/persistance/reposistories/company-users.prisma.repository';
import { AssignUserToCompanyUseCase } from 'src/application/use-cases/company-users/assign-user-to-company.usecase';
import {
  ICOMPANY_REPO,
  ICompanyRepository,
} from 'src/domain/repositories/company.repository';
import {
  IUserRepository,
  USER_REPOSITORY,
} from 'src/domain/repositories/user.repository';
import { CompanyPrismaRepository } from 'src/infrastructure/persistance/reposistories/company.prisma.repository';
import { UserPrismaRepository } from 'src/infrastructure/persistance/reposistories/user.prisma.repository';

@Module({
  imports: [PrismaModule],
  controllers: [CompanyUsersController],
  providers: [
    {
      provide: ICOMPANYUSER_REPO,
      useClass: CompanyUserPrismaRepository,
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
      provide: AssignUserToCompanyUseCase,
      useFactory: (
        repo: ICompanyUsersRepository,
        companyRepo: ICompanyRepository,
        userRepo: IUserRepository,
      ) => new AssignUserToCompanyUseCase(repo, companyRepo, userRepo),
      inject: [ICOMPANYUSER_REPO, ICOMPANY_REPO, USER_REPOSITORY],
    },
  ],
})
export class CompanyUsersModule {}

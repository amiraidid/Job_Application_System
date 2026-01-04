import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma.module';
import { CompanyController } from '../controllers/company.controller';
import {
  ICOMPANY_REPO,
  ICompanyRepository,
} from 'src/domain/repositories/company.repository';
import { CompanyPrismaRepository } from 'src/infrastructure/persistance/reposistories/company.prisma.repository';
import { CreateCompanyUseCase } from 'src/application/use-cases/company/create-company.usecase';
import { GetCompanyByIdUseCase } from 'src/application/use-cases/company/get-company-byId.usecase';
import {
  IUserRepository,
  USER_REPOSITORY,
} from 'src/domain/repositories/user.repository';
import { UserPrismaRepository } from 'src/infrastructure/persistance/reposistories/user.prisma.repository';

@Module({
  imports: [PrismaModule],
  controllers: [CompanyController],
  providers: [
    {
      provide: ICOMPANY_REPO,
      useClass: CompanyPrismaRepository,
    },
    {
      provide: USER_REPOSITORY,
      useClass: UserPrismaRepository,
    },
    {
      provide: CreateCompanyUseCase,
      useFactory: (repo: ICompanyRepository, userRepo: IUserRepository) =>
        new CreateCompanyUseCase(repo, userRepo),
      inject: [ICOMPANY_REPO, USER_REPOSITORY],
    },
    {
      provide: GetCompanyByIdUseCase,
      useFactory: (repo: ICompanyRepository) => new GetCompanyByIdUseCase(repo),
      inject: [ICOMPANY_REPO],
    },
  ],
})
export class CompanyModule {}

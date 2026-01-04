import { ForbiddenError } from 'src/domain/core/errors/ForbiddenError';
import { NotFoundError } from 'src/domain/core/errors/NotFoundError';
import { ApplicationEntity } from 'src/domain/entities/application.entity';
import { IApplicationRepository } from 'src/domain/repositories/application.repository';
import { ICompanyRepository } from 'src/domain/repositories/company.repository';
import { IUserRepository } from 'src/domain/repositories/user.repository';

export class FindApplicationByIdUseCase {
  constructor(
    private readonly applicationRepository: IApplicationRepository,
    private readonly companyRepo: ICompanyRepository,
    private readonly userRepo: IUserRepository,
  ) {}

  async execute(
    id: string,
    tenantId: string,
    userId: string,
  ): Promise<ApplicationEntity> {
    const company = await this.companyRepo.GetCompanyById(tenantId);
    if (!company) {
      throw new NotFoundError(`Not found any Company with this ${tenantId}`);
    }

    const user = await this.userRepo.FindUserById(userId);
    if (!user) {
      throw new NotFoundError(`Not found any User with this ${userId}`);
    }

    const co_user = user?.companyUsers?.find((usr) => {
      return (
        usr.companyId == company.id &&
        (usr.role == 'HR' || usr.role == 'ADMIN' || usr.role == 'INTERVIEWER')
      );
    });

    const application =
      await this.applicationRepository.FindApplicationById(id);
    if (!application) {
      throw new NotFoundError('Application Not Found');
    }

    // allow if user owns the application OR user belongs to the company with proper role
    if (user.id !== application.userId && co_user?.companyId !== company.id) {
      throw new ForbiddenError(
        'Sorry, you don`t have the permissions to perform this action',
      );
    }

    return application;
  }
}

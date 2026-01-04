import { ForbiddenError } from 'src/domain/core/errors/ForbiddenError';
import { NotFoundError } from 'src/domain/core/errors/NotFoundError';
import { ApplicationEntity } from 'src/domain/entities/application.entity';
import { IApplicationRepository } from 'src/domain/repositories/application.repository';
import { ICompanyRepository } from 'src/domain/repositories/company.repository';
import { IUserRepository } from 'src/domain/repositories/user.repository';

export class GetApplicationsForJobUseCase {
  constructor(
    private readonly applicationRepo: IApplicationRepository,
    private readonly companyRepo: ICompanyRepository,
    private readonly userRepo: IUserRepository,
  ) {}

  async execute(
    id: string,
    tenantId: string,
    userId: string,
  ): Promise<ApplicationEntity[]> {
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
    if (company.id !== co_user?.companyId) {
      throw new ForbiddenError(
        'Sorry, you don`t have the permissions to perform this action',
      );
    }
    const applications = await this.applicationRepo.GetApplicationsForJob(id);
    if (!applications) {
      throw new NotFoundError("Did't find any applictions for this job");
    }
    return applications;
  }
}

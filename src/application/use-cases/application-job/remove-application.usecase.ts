import { IApplicationRepository } from 'src/domain/repositories/application.repository';
import { RemoveResumeUseCase } from './remove-resume.usecase';
import { ICompanyRepository } from 'src/domain/repositories/company.repository';
import { IUserRepository } from 'src/domain/repositories/user.repository';
import { ForbiddenError } from 'src/domain/core/errors/ForbiddenError';
import { NotFoundError } from 'src/domain/core/errors/NotFoundError';

export class RemoveApplicationUseCase {
  constructor(
    private readonly applicationRepo: IApplicationRepository,
    private readonly removeResume: RemoveResumeUseCase,
    private readonly companyRepo: ICompanyRepository,
    private readonly userRepo: IUserRepository,
  ) {}

  async execute(id: string, tenantId: string, userId: string): Promise<void> {
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
        usr.companyId == company.id && (usr.role == 'HR' || usr.role == 'ADMIN')
      );
    });

    const application = await this.applicationRepo.FindApplicationById(id);
    if (!application) {
      throw new NotFoundError('Not Found the application');
    }

    if (user.id !== application.userId && company.id !== co_user?.companyId) {
      throw new ForbiddenError(
        'Sorry, you don`t have the permissions to perform this action',
      );
    }

    const removeResume = await this.removeResume.execute(application.publicId);

    if (!removeResume) {
      throw new NotFoundError('Failed to delete the resume...');
    }

    await this.applicationRepo.RemoveApplicationById(id, application.publicId);
  }
}

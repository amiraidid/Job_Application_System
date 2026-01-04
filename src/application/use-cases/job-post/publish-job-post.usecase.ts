import { ForbiddenError } from 'src/domain/core/errors/ForbiddenError';
import { NotFoundError } from 'src/domain/core/errors/NotFoundError';
import { JobPost } from 'src/domain/entities/job-post.entity';
import { ICompanyRepository } from 'src/domain/repositories/company.repository';
import { IJobPostRepository } from 'src/domain/repositories/job-post.repository';
import { IUserRepository } from 'src/domain/repositories/user.repository';

// @Injectable()
export class PublishJobPostUseCase {
  constructor(
    private readonly jobRepo: IJobPostRepository,
    private readonly companyRepo: ICompanyRepository,
    private readonly userRepo: IUserRepository,
  ) {}

  async execute(
    id: string,
    tenantId: string,
    userId: string,
  ): Promise<JobPost> {
    const user = await this.userRepo.FindUserById(userId);
    if (!user) {
      throw new NotFoundError(`Not found any User with this ${userId}`);
    }

    const company = await this.companyRepo.GetCompanyById(tenantId);
    if (!company) {
      throw new NotFoundError(`Not found any Company with this ${tenantId}`);
    }
    const job = await this.jobRepo.FindByIdPost(id, company.id);
    if (!job) {
      throw new NotFoundError(`Not Found any job with this ${id}`);
    }

    const co_user = user?.companyUsers?.find((usr) => {
      return (
        usr.companyId == job.companyId &&
        (usr.role == 'HR' || usr.role == 'ADMIN')
      );
    });

    if (company.id !== co_user?.companyId) {
      throw new ForbiddenError(
        'Sorry, you don`t have the permissions to perform this action',
      );
    }

    const updateJob = await this.jobRepo.PublishJobPost(id, company.id);
    return updateJob;
  }
}

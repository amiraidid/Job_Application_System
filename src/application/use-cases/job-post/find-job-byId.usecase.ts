import { NotFoundError } from 'src/domain/core/errors/NotFoundError';
import { JobPost } from 'src/domain/entities/job-post.entity';
import { ICompanyRepository } from 'src/domain/repositories/company.repository';
import { IJobPostRepository } from 'src/domain/repositories/job-post.repository';

export class FindByIdPostUseCase {
  constructor(
    private readonly jobRepo: IJobPostRepository,
    private readonly companyRepo: ICompanyRepository,
  ) {}

  async execute(id: string, tenantId: string): Promise<JobPost> {
    const company = await this.companyRepo.GetCompanyById(tenantId);
    if (!company) {
      throw new NotFoundError(`Not found any Company with this ${tenantId}`);
    }
    const job = await this.jobRepo.FindByIdPost(id, company.id);
    if (!job) {
      throw new NotFoundError(`Not found any Job with this ${id}`);
    }
    return job;
  }
}

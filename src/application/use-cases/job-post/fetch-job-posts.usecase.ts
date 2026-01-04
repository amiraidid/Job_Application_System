import { NotFoundError } from 'src/domain/core/errors/NotFoundError';
import { JobPost } from 'src/domain/entities/job-post.entity';
import { ICompanyRepository } from 'src/domain/repositories/company.repository';
import { IJobPostRepository } from 'src/domain/repositories/job-post.repository';

export class FetchJobPostsUseCase {
  constructor(
    private readonly jobRepo: IJobPostRepository,
    private readonly companyRepo: ICompanyRepository,
  ) {}

  async execute(tenantId: string): Promise<JobPost[]> {
    const company = await this.companyRepo.GetCompanyById(tenantId);
    if (!company) {
      throw new NotFoundError(`Not found any Company with this ${tenantId}`);
    }

    const jobs = await this.jobRepo.FetchJobPosts(company.id);
    return jobs;
  }
}

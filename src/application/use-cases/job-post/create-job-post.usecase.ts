import { CreateJobPostDto } from 'src/application/dtos/job-post/create-job-post.dto';
import { ForbiddenError } from 'src/domain/core/errors/ForbiddenError';
import { NotFoundError } from 'src/domain/core/errors/NotFoundError';
import { ValidationError } from 'src/domain/core/errors/ValidationError';
import { JobPost } from 'src/domain/entities/job-post.entity';
import { ICompanyRepository } from 'src/domain/repositories/company.repository';
import { IJobPostRepository } from 'src/domain/repositories/job-post.repository';
import { IUserRepository } from 'src/domain/repositories/user.repository';

export class CreateJobPostUseCase {
  constructor(
    private readonly jobRepository: IJobPostRepository,
    private readonly companyRepo: ICompanyRepository,
    private readonly userRepo: IUserRepository,
  ) {}

  async execute(
    dto: CreateJobPostDto,
    companyId: string,
    userId: string,
  ): Promise<void> {
    const company = await this.companyRepo.GetCompanyById(companyId);
    if (!company) {
      throw new NotFoundError(`Not found a company with this ${companyId}`);
    }

    const user = await this.userRepo.FindUserById(userId);
    if (!user) {
      throw new NotFoundError(`Not found any User with this ${userId}`);
    }
    const job = new JobPost(
      dto.title,
      dto.description,
      dto.requirements,
      company.id,
      user.id,
    );

    if (!job.isValid) {
      throw new ValidationError('The Inserted Data is not valid.');
    }
    const co_user = user?.companyUsers?.find((usr) => {
      return (
        usr.companyId == job.companyId &&
        (usr.role == 'HR' || usr.role == 'ADMIN')
      );
    });
    if (job.companyId !== co_user?.companyId) {
      throw new ForbiddenError(
        'Sorry, you don`t have the permissions to perform this action',
      );
    }

    await this.jobRepository.CreateJobPost(job);
  }
}

import { ConflictError } from 'src/domain/core/errors/ConflictError';
import { ForbiddenError } from 'src/domain/core/errors/ForbiddenError';
import { NotFoundError } from 'src/domain/core/errors/NotFoundError';
import { InterviewEntity } from 'src/domain/entities/interview.entity';
import { IApplicationRepository } from 'src/domain/repositories/application.repository';
import { ICompanyRepository } from 'src/domain/repositories/company.repository';
import { INterviewRepository } from 'src/domain/repositories/interview.repository';

export class FindInterviewByIdUseCase {
  constructor(
    private readonly interviewRepo: INterviewRepository,
    private readonly companyRepo: ICompanyRepository,
    private readonly applicationRepo: IApplicationRepository,
  ) {}

  async execute(id: string, tenantId: string): Promise<InterviewEntity> {
    const company = await this.companyRepo.GetCompanyById(tenantId);
    if (!company) {
      throw new NotFoundError(
        `Not Found any associated company with this ${tenantId}`,
      );
    }

    const interview = await this.interviewRepo.FindInterviewById(id);
    if (!interview) {
      throw new NotFoundError(
        `Not Found any associated Interview with this ${id}`,
      );
    }

    const application = await this.applicationRepo.FindApplicationById(
      interview.applicationId,
    );
    if (!application) {
      throw new NotFoundError(
        `Not Found any Application with this ${interview.applicationId}`,
      );
    }

    if (application.id !== interview.applicationId) {
      throw new ConflictError(
        `This Interview does not belong to this Application`,
      );
    }

    if (interview.companyId !== company.id) {
      throw new ForbiddenError(
        `Sorry! You dont have permissions to perform this`,
      );
    }

    return interview;
  }
}

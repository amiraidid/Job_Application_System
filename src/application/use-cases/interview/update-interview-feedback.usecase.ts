import { ForbiddenError } from 'src/domain/core/errors/ForbiddenError';
import { NotFoundError } from 'src/domain/core/errors/NotFoundError';
import { InterviewEntity } from 'src/domain/entities/interview.entity';
import { ICompanyRepository } from 'src/domain/repositories/company.repository';
import { INterviewRepository } from 'src/domain/repositories/interview.repository';
import { IUserRepository } from 'src/domain/repositories/user.repository';

export class UpdateInterviewFeedbackUseCase {
  constructor(
    private readonly interviewRepo: INterviewRepository,
    private readonly companyRepo: ICompanyRepository,
    private readonly userRepo: IUserRepository,
  ) {}

  async execute(
    id: string,
    feedback: string,
    status: string,
    tenantId: string,
    userId: string,
  ): Promise<InterviewEntity> {
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

    const user = await this.userRepo.FindUserById(userId);
    if (!user) {
      throw new NotFoundError(`Not found any User with this ${userId}`);
    }

    const co_user = user?.companyUsers?.find((usr) => {
      return (
        (usr.companyId == company.id &&
          (usr.role == 'ADMIN' || usr.role == 'HR')) ||
        usr.role == 'INTERVIEWER'
      );
    });

    if (
      co_user?.companyId !== company.id ||
      interview.companyId !== company.id
    ) {
      throw new ForbiddenError(
        `Sorry! You dont have a permission to perform this`,
      );
    }

    const updatedInterview = await this.interviewRepo.UpdateInterviewFeedback(
      interview.id,
      feedback,
      status,
    );
    return updatedInterview;
  }
}

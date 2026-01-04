import { ForbiddenError } from 'src/domain/core/errors/ForbiddenError';
import { NotFoundError } from 'src/domain/core/errors/NotFoundError';
import { CommentEntity } from 'src/domain/entities/comment.entity';
import { IApplicationRepository } from 'src/domain/repositories/application.repository';
import { ICommentRepository } from 'src/domain/repositories/comment.repository';
import { ICompanyRepository } from 'src/domain/repositories/company.repository';
import { IUserRepository } from 'src/domain/repositories/user.repository';

export class GetApplicationCommentsUseCase {
  constructor(
    private readonly commentRepo: ICommentRepository,
    private readonly applicationRepo: IApplicationRepository,
    private readonly companyRepo: ICompanyRepository,
    private readonly userRepo: IUserRepository,
  ) {}

  async execute(
    applicationId: string,
    companyId: string,
    userId: string,
  ): Promise<CommentEntity[]> {
    const company = await this.companyRepo.GetCompanyById(companyId);
    if (!company) {
      throw new NotFoundError(`Not found a company with this ${companyId}`);
    }

    const user = await this.userRepo.FindUserById(userId);
    if (!user) {
      throw new NotFoundError(`Didn\\'t find any user with this id ${userId}`);
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

    const application =
      await this.applicationRepo.FindApplicationById(applicationId);
    if (!application) {
      throw new NotFoundError(
        `Not Found any application with this ${applicationId}`,
      );
    }
    const comments = await this.commentRepo.GetApplicationComment(
      application.id,
    );
    return comments;
  }
}

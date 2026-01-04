import { AddCommentApplicationDto } from 'src/application/dtos/comments-dtos/add-comment.dto';
import { ForbiddenError } from 'src/domain/core/errors/ForbiddenError';
import { NotFoundError } from 'src/domain/core/errors/NotFoundError';
import { ValidationError } from 'src/domain/core/errors/ValidationError';
import { CommentEntity } from 'src/domain/entities/comment.entity';
import { CommentAddedEvent } from 'src/domain/events/comment-added.event';
import { IApplicationRepository } from 'src/domain/repositories/application.repository';
import { ICommentRepository } from 'src/domain/repositories/comment.repository';
import { ICompanyRepository } from 'src/domain/repositories/company.repository';
import { IUserRepository } from 'src/domain/repositories/user.repository';
import { IEventBus } from 'src/domain/services/event-bus.intetface';

export class AddCommentUseCase {
  constructor(
    private readonly commentRepo: ICommentRepository,
    private readonly applicationRepo: IApplicationRepository,
    private readonly userRepo: IUserRepository,
    private readonly companyRepo: ICompanyRepository,
    private readonly eventBus: IEventBus,
  ) {}

  async execute(
    dto: AddCommentApplicationDto,
    companyId: string,
    userId: string,
  ): Promise<CommentEntity> {
    const { message, applicationId } = dto;
    if (!message || !applicationId) {
      throw new ValidationError(`Please fill all the fields.`);
    }

    const company = await this.companyRepo.GetCompanyById(companyId);
    if (!company) {
      throw new NotFoundError(`Not found a company with this ${companyId}`);
    }

    const application =
      await this.applicationRepo.FindApplicationById(applicationId);
    if (!application) {
      throw new NotFoundError(
        `Didn\\'t find any application with this id ${applicationId}`,
      );
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

    const comment = new CommentEntity(
      message,
      application.id,
      user.id,
      company.id,
    );
    if (!comment.isValid) {
      throw new ValidationError('Please, the inserted data is invalid');
    }

    const added_comment = await this.commentRepo.AddComment(comment);
    this.eventBus.publish(new CommentAddedEvent(added_comment.id));
    return added_comment;
  }
}

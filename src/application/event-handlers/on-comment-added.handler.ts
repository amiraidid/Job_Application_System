import { Inject, Injectable } from '@nestjs/common';
import { CreateNotificationUseCase } from '../use-cases/notifications/create-notification.usecase';
import { ICOMMENT_REPO } from 'src/domain/repositories/comment.repository';
import type { ICommentRepository } from 'src/domain/repositories/comment.repository';
import { OnEvent } from '@nestjs/event-emitter';
import { CommentAddedEvent } from 'src/domain/events/comment-added.event';
import { NotFoundError } from 'src/domain/core/errors/NotFoundError';
import { ICOMPANY_REPO } from 'src/domain/repositories/company.repository';
import type { ICompanyRepository } from 'src/domain/repositories/company.repository';

@Injectable()
export class onCommentAddedHandler {
  constructor(
    private readonly createNotification: CreateNotificationUseCase,
    @Inject(ICOMMENT_REPO)
    private readonly commentRepo: ICommentRepository,
    @Inject(ICOMPANY_REPO)
    private readonly companyRepo: ICompanyRepository,
  ) {}

  @OnEvent('CommentAddedEvent')
  async handle(event: CommentAddedEvent) {
    const comment = await this.commentRepo.GetCommentById(event.commentId);
    if (!comment) {
      throw new NotFoundError(
        `Not found any Comment this this ${event.commentId}`,
      );
    }

    const company = await this.companyRepo.GetCompanyById(comment.companyId);
    if (!company) {
      throw new NotFoundError(
        `Not found any Company this this ${comment.companyId}`,
      );
    }

    const co_users = company.companyUsers.filter(
      (usr) =>
        usr.role == 'ADMIN' || usr.role == 'HR' || usr.role == 'INTERVIEWER',
    );

    for (const usr of co_users) {
      await this.createNotification.execute({
        companyId: company.id,
        userId: usr.userId,
        title: 'New Comment Added',
        message: 'A new comment has been added.',
        type: 'COMMENT_ADDED',
      });
    }
  }
}

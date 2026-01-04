import { CommentEntity } from '../entities/comment.entity';

export interface ICommentRepository {
  AddComment(comment: CommentEntity): Promise<CommentEntity>;
  GetCommentById(commentId: string): Promise<CommentEntity>;
  GetApplicationComment(applicationId: string): Promise<CommentEntity[]>;
  RemoveCommentById(commentId: string): Promise<CommentEntity>;
}

export const ICOMMENT_REPO = Symbol('ICOMMENT_REPO');

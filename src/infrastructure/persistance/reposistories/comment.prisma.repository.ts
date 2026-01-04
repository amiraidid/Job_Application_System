/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { Injectable } from '@nestjs/common';
import { CommentEntity } from 'src/domain/entities/comment.entity';
import { ICommentRepository } from 'src/domain/repositories/comment.repository';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { CommentMapperPersistence } from '../mappers/comment.mapper';
import { InternalServerError } from 'src/domain/core/errors/InternalServerError';
import { NotFoundError } from 'src/domain/core/errors/NotFoundError';

@Injectable()
export class CommentPrismaRepository implements ICommentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async AddComment(comment: CommentEntity): Promise<CommentEntity> {
    try {
      const create_comment = await this.prisma.comment.create({
        data: {
          message: comment.message,
          applicationId: comment.applicationId,
          userId: comment.userId,
          companyId: comment.companyId,
        },
        include: { user: true },
      });
      return CommentMapperPersistence.toDomain(create_comment);
    } catch (error) {
      throw new InternalServerError(error.message);
    }
  }

  async GetCommentById(commentId: string): Promise<CommentEntity> {
    try {
      const comment = await this.prisma.comment.findUnique({
        where: { id: commentId },
        include: { user: true },
      });

      if (!comment) {
        throw new NotFoundError(`Not Found a comment with this ${commentId}`);
      }
      return CommentMapperPersistence.toDomain(comment);
    } catch (error) {
      throw new InternalServerError(error.message);
    }
  }

  async GetApplicationComment(applicationId: string): Promise<CommentEntity[]> {
    try {
      const comments = await this.prisma.comment.findMany({
        where: { applicationId },
        include: { user: true },
      });
      if (!comments) {
        throw new NotFoundError('Not Found');
      }
      return CommentMapperPersistence.toDomainArray(comments);
    } catch (error) {
      throw new InternalServerError(error.message);
    }
  }

  async RemoveCommentById(commentId: string): Promise<CommentEntity> {
    try {
      const comment = await this.prisma.comment.delete({
        where: { id: commentId },
        include: { user: true },
      });
      if (!comment) {
        throw new NotFoundError(`Not found any Comment with this ${commentId}`);
      }
      return CommentMapperPersistence.toDomain(comment);
    } catch (error) {
      throw new InternalServerError(error.message);
    }
  }
}

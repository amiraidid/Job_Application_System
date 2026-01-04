/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { InterviewEntity } from 'src/domain/entities/interview.entity';
import { INterviewRepository } from 'src/domain/repositories/interview.repository';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { InterviewPersistenceMapper } from 'src/infrastructure/persistance/mappers/interview.mapper';
import { NotFoundError } from 'src/domain/core/errors/NotFoundError';
import { ConflictError } from 'src/domain/core/errors/ConflictError';
import { InternalServerError } from 'src/domain/core/errors/InternalServerError';
import { BadRequestError } from 'src/domain/core/errors/BadRequestError';
import { Status } from 'src/domain/enums/application-status.enum';

@Injectable()
export class InterviewPrismaRepository implements INterviewRepository {
  constructor(private readonly prisma: PrismaService) {}

  async ScheduleInterview(
    interview: InterviewEntity,
  ): Promise<InterviewEntity> {
    try {
      // ensure the referenced JobApplication exists to avoid FK violations
      const application = await this.prisma.jobApplication.findUnique({
        where: { id: interview.applicationId },
      });
      if (!application) {
        throw new NotFoundError(
          `Job application with id ${interview.applicationId} not found`,
        );
      }
      // ensure application belongs to the same company as the interview entity
      if (
        application.companyId &&
        interview.companyId &&
        application.companyId !== interview.companyId
      ) {
        throw new ConflictError(
          'Application does not belong to the provided company',
        );
      }
      const schedule = await this.prisma.interview.create({
        data: {
          interviewerId: interview.interviewerId,
          applicationId: interview.applicationId,
          time: interview.time,
          feedback: interview.feedback,
          companyId: interview.companyId,
        },
        include: { jobApplication: true, user: true },
      });
      if (!schedule) {
        throw new ConflictError(
          'Failed to schedule a interview. Please try again',
        );
      }
      return InterviewPersistenceMapper.toDomain(schedule);
    } catch (error) {
      throw new InternalServerError(error.message);
    }
  }

  async FindInterviewById(id: string): Promise<InterviewEntity> {
    try {
      const interview = await this.prisma.interview.findUnique({
        where: { id: id },
        include: { jobApplication: true },
      });

      if (!interview) {
        throw new NotFoundError(
          `Not Found any associated interview this ${id}`,
        );
      }

      return InterviewPersistenceMapper.toDomain(interview);
    } catch (error) {
      throw new InternalServerError(error.message);
    }
  }

  async UpdateInterviewFeedback(
    id: string,
    feedback: string,
    status: Status,
  ): Promise<InterviewEntity> {
    try {
      const interview = await this.FindInterviewById(id);
      if (!interview) {
        throw new NotFoundError(
          `Not Found any associated interview this ${id}`,
        );
      }

      const updatefeedback = await this.prisma.interview.update({
        where: { id: interview.id },
        data: {
          feedback,
        },
        include: { jobApplication: true },
      });

      if (!updatefeedback) {
        throw new BadRequestError(
          `Sorry, Failed to update the feedback, please try again`,
        );
      }

      await this.prisma.jobApplication.update({
        where: { id: updatefeedback.applicationId },
        data: { status: status },
      });

      return InterviewPersistenceMapper.toDomain(updatefeedback);
    } catch (error) {
      throw new InternalServerError(error.message);
    }
  }

  async RemoveInterview(id: string): Promise<string> {
    try {
      const interview = await this.FindInterviewById(id);
      if (!interview) {
        throw new NotFoundError(
          `Not Found any associated interview this ${id}`,
        );
      }

      await this.prisma.interview.delete({
        where: { id: interview.id },
      });

      return `Successfully deleted this application interview`;
    } catch (error) {
      throw new InternalServerError(error.message);
    }
  }
}

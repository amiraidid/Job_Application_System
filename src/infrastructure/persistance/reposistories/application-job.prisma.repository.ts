/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Injectable } from '@nestjs/common';
import { ApplicationEntity } from 'src/domain/entities/application.entity';
import { IApplicationRepository } from 'src/domain/repositories/application.repository';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { ApplicationJobPersistenceMapper } from 'src/infrastructure/persistance/mappers/application-job.mapper';
import { InternalServerError } from 'src/domain/core/errors/InternalServerError';
import { NotFoundError } from 'src/domain/core/errors/NotFoundError';
import { Status } from 'src/domain/enums/application-status.enum';

@Injectable()
export class applicationJobPrismaRepository implements IApplicationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async ApplyToJob(application: ApplicationEntity): Promise<ApplicationEntity> {
    try {
      const appl = await this.prisma.jobApplication.create({
        data: {
          jobId: application.jobId,
          resumeUrl: application.resumeUrl,
          publicId: application.publicId,
          status: Status.SUBMITTED,
          companyId: application.companyId,
          userId: application.userId,
        },
        include: { user: true },
      });

      return ApplicationJobPersistenceMapper.toDomain(appl);
    } catch (error) {
      throw new InternalServerError(error.message);
    }
  }

  async FindApplicationById(id: string): Promise<ApplicationEntity> {
    try {
      const appl = await this.prisma.jobApplication.findUnique({
        where: { id: id },
        include: { user: true },
      });

      if (!appl) {
        throw new NotFoundError('Application Not Found.');
      }
      return ApplicationJobPersistenceMapper.toDomain(appl);
    } catch (error) {
      throw new InternalServerError(error.message);
    }
  }

  async UpdateApplicationStatus(
    id: string,
    status: Status,
  ): Promise<ApplicationEntity> {
    try {
      const updated = await this.prisma.jobApplication.update({
        where: { id: id },
        data: { status },
        include: { user: true },
      });

      if (!updated) {
        throw new NotFoundError('Sorry, Not Found that application');
      }

      return ApplicationJobPersistenceMapper.toDomain(updated);
    } catch (error) {
      throw new InternalServerError(error.message);
    }
  }

  async RemoveApplicationById(id: string): Promise<void> {
    try {
      await this.prisma.$transaction(async (tx) => {
        const application = await tx.jobApplication.findUnique({
          where: { id: id },
          include: { interview: true },
        });

        if (!application) {
          throw new NotFoundError(`Not Found The Application ${id}`);
        }

        if (application.interview) {
          await tx.interview.delete({
            where: { id: application.interview.id },
          });
        }

        await tx.jobApplication.delete({
          where: { id: application.id },
        });
      });
    } catch (error) {
      throw new InternalServerError(error.message);
    }
  }

  async GetApplicationsForJob(id: string): Promise<ApplicationEntity[]> {
    try {
      const jobs = await this.prisma.jobPost.findUnique({
        where: { id: id },
        include: { jobApplications: { include: { user: true } } },
      });

      if (!jobs) {
        throw new NotFoundError('The Job does not exist.');
      }

      return ApplicationJobPersistenceMapper.toDomainArray(
        jobs.jobApplications,
      );
    } catch (error) {
      throw new InternalServerError(error.message);
    }
  }
}

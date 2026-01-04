/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { JobPost } from 'src/domain/entities/job-post.entity';
import { IJobPostRepository } from 'src/domain/repositories/job-post.repository';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { JobPostPersistenceMapper } from 'src/infrastructure/persistance/mappers/job-post.mapper';
import { ConflictError } from 'src/domain/core/errors/ConflictError';
import { InternalServerError } from 'src/domain/core/errors/InternalServerError';
import { NotFoundError } from 'src/domain/core/errors/NotFoundError';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JobPostPrimsaRepository implements IJobPostRepository {
  constructor(private readonly prisma: PrismaService) {}
  async CreateJobPost(job: JobPost): Promise<JobPost> {
    try {
      const createdJob = await this.prisma.jobPost.create({
        data: {
          title: job.title,
          description: job.description,
          requirements: job.requirement,
          isPublished: false,
          companyId: job.companyId,
          userId: job.userId,
        },
      });
      if (!createdJob) {
        throw new ConflictError(`Failed to create this job`);
      }
      return JobPostPersistenceMapper.toDomain(createdJob);
    } catch (error) {
      throw new InternalServerError(error.message);
    }
  }

  async UpdateJobPost(job: JobPost, id: string): Promise<JobPost> {
    const singleJob = await this.prisma.jobPost.findFirst({
      where: { id: id, companyId: job.companyId },
    });

    if (!singleJob) {
      throw new NotFoundError('Not found, please try again');
    }

    const updated = await this.prisma.jobPost.update({
      where: { id: singleJob.id },
      data: {
        title: job.title || singleJob.title,
        description: job.description || singleJob.description,
        requirements: job.requirement || singleJob.requirements,
      },
    });
    if (!updated) {
      throw new ConflictError(
        `Failed to update this job with ${singleJob.title}, Please try again`,
      );
    }

    return JobPostPersistenceMapper.toDomain(updated);
  }

  async FindByIdPost(id: string, tenantId: string): Promise<JobPost> {
    const job = await this.prisma.jobPost.findFirst({
      where: { id: id, companyId: tenantId },
    });

    if (!job) {
      throw new NotFoundError('Not Found that Job');
    }
    return JobPostPersistenceMapper.toDomain(job);
  }

  async PublishJobPost(id: string, tenantId: string): Promise<JobPost> {
    const job = await this.prisma.jobPost.findFirst({
      where: { id: id, companyId: tenantId },
    });

    if (!job) {
      throw new NotFoundError('Not Found that Job');
    }

    const publishJob = await this.prisma.jobPost.update({
      where: { id: job.id },
      data: {
        isPublished: true,
      },
    });

    if (!publishJob) {
      throw new ConflictError(`Unable to Publish this job ${job.title}`);
    }
    return JobPostPersistenceMapper.toDomain(publishJob);
  }

  async UnPublishJobPost(id: string, tenantId: string): Promise<JobPost> {
    const job = await this.prisma.jobPost.findFirst({
      where: { id: id, companyId: tenantId },
    });

    if (!job) {
      throw new NotFoundError('Not Found that Job');
    }

    const unpublishJob = await this.prisma.jobPost.update({
      where: { id: job.id },
      data: {
        isPublished: false,
      },
    });

    if (!unpublishJob) {
      throw new ConflictError(`Unable to Un-Publish this job ${job.title}`);
    }
    return JobPostPersistenceMapper.toDomain(unpublishJob);
  }

  async RemoveJobPost(id: string, tenantId: string): Promise<JobPost> {
    const job = await this.prisma.jobPost.findFirst({
      where: { id: id, companyId: tenantId },
    });

    if (!job) {
      throw new NotFoundError('Not Found that Job');
    }

    const removeJobPost = await this.prisma.jobPost.delete({
      where: { id: job.id },
    });
    return JobPostPersistenceMapper.toDomain(removeJobPost);
  }

  async FetchJobPosts(tenantId: string): Promise<JobPost[]> {
    const jobs = await this.prisma.jobPost.findMany({
      where: { companyId: tenantId },
      include: { jobApplications: true },
    });

    if (!jobs || jobs.length === 0) {
      throw new NotFoundError('Not Found any Jobs');
    }
    return JobPostPersistenceMapper.toDomainArray(jobs);
  }
}

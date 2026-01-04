import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CreateJobPostUseCase } from 'src/application/use-cases/job-post/create-job-post.usecase';
import { CreateJobPostHttpDto } from '../dtos/job-post/create-job-post.dto';
import { UpdateJobPostHttpDto } from '../dtos/job-post/update-job-post.dto';
import { UpdateJobPostUseCase } from 'src/application/use-cases/job-post/update-job-post.usecase';
import { PublishJobPostUseCase } from 'src/application/use-cases/job-post/publish-job-post.usecase';
import { UnPublishJobPostUseCase } from 'src/application/use-cases/job-post/unpublish-job-post.usecase';
import { RemoveJobPostUseCase } from 'src/application/use-cases/job-post/remove-job-post.usecase';
import { FetchJobPostsUseCase } from 'src/application/use-cases/job-post/fetch-job-posts.usecase';
import { JobPostPersistenceMapper } from 'src/infrastructure/persistance/mappers/job-post.mapper';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { TenantGuard } from '../auth/guards/tenant.guard';
import { Tenant } from '../auth/decorators/tenant.decorator';
import { FindByIdPostUseCase } from 'src/application/use-cases/job-post/find-job-byId.usecase';
import { GetProfile } from '../auth/decorators/get-profile.decorator';

@Controller('api/v1/jobs')
export class JobPostController {
  constructor(
    private readonly jobPost: CreateJobPostUseCase,
    private readonly updateJob: UpdateJobPostUseCase,
    private readonly publishJob: PublishJobPostUseCase,
    private readonly unPublishJob: UnPublishJobPostUseCase,
    private readonly removeJob: RemoveJobPostUseCase,
    private readonly fetchJobs: FetchJobPostsUseCase,
    private readonly findJob: FindByIdPostUseCase,
  ) {}

  @Post('company/:tenantId/create-job')
  @UseGuards(JwtGuard, TenantGuard)
  async create(
    @Body() dto: CreateJobPostHttpDto,
    @Tenant() tenantId: string,
    @GetProfile('sub') userId: string,
  ) {
    await this.jobPost.execute(dto, tenantId, userId);
    return `Created Successfully`;
  }

  @Get('company/:tenantId/fetch-jobs')
  async getJobs(@Tenant() tenantId: string) {
    const jobs = await this.fetchJobs.execute(tenantId);
    return JobPostPersistenceMapper.toPersistenceArray(jobs);
  }

  @Put('company/:tenantId/update-job/:id')
  @UseGuards(JwtGuard, TenantGuard)
  async update(
    @Body() dto: UpdateJobPostHttpDto,
    @Param('id') id: string,
    @Tenant() tenantId: string,
    @GetProfile('sub') userId: string,
  ) {
    const res = await this.updateJob.execute(dto, id, tenantId, userId);
    return JobPostPersistenceMapper.toPersistence(res);
  }

  @Get('company/:tenantId/job/:id')
  async findById(@Param('id') id: string, @Tenant() tenantId: string) {
    const res = await this.findJob.execute(id, tenantId);
    return JobPostPersistenceMapper.toPersistence(res);
  }

  @Put('company/:tenantId/publish/:id')
  @UseGuards(JwtGuard, TenantGuard)
  async publish(
    @Param('id') id: string,
    @Tenant() tenantId: string,
    @GetProfile('sub') userId: string,
  ) {
    const res = await this.publishJob.execute(id, tenantId, userId);
    return JobPostPersistenceMapper.toPersistence(res);
  }

  @Put('company/:tenantId/unpublish/:id')
  @UseGuards(JwtGuard, TenantGuard)
  async unpublish(
    @Param('id') id: string,
    @Tenant() tenantId: string,
    @GetProfile('sub') userId: string,
  ) {
    const res = await this.unPublishJob.execute(id, tenantId, userId);
    return JobPostPersistenceMapper.toPersistence(res);
  }

  @Delete('company/:tenantId/remove-job/:id')
  @UseGuards(JwtGuard, TenantGuard)
  async remove(
    @Param('id') id: string,
    @Tenant() tenantId: string,
    @GetProfile('sub') userId: string,
  ) {
    const res = await this.removeJob.execute(id, tenantId, userId);
    return JobPostPersistenceMapper.toPersistence(res);
  }
}

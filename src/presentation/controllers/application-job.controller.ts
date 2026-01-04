import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApplyToJobUseCase } from 'src/application/use-cases/application-job/apply-to-job.usecase';
import { ApplicationJobPersistenceMapper } from '../../infrastructure/persistance/mappers/application-job.mapper';
import { ApplyToJobHttpDto } from '../dtos/application-job/apply-to-job.dto';
import { FindApplicationByIdUseCase } from 'src/application/use-cases/application-job/find-application-byId.usecase';
import { UpdateApplicationStatusUseCase } from 'src/application/use-cases/application-job/update-application-status.usecase';
import { FileInterceptor } from '@nestjs/platform-express';
import multer from 'multer';
import { RemoveApplicationUseCase } from 'src/application/use-cases/application-job/remove-application.usecase';
import { GetApplicationsForJobUseCase } from 'src/application/use-cases/application-job/get-applications-for-job.usecase';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { GetProfile } from '../auth/decorators/get-profile.decorator';
import { Tenant } from '../auth/decorators/tenant.decorator';
import { TenantGuard } from '../auth/guards/tenant.guard';
import { Role } from 'src/domain/enums/user-roles.enum';
import { Status } from 'src/domain/enums/application-status.enum';

@Controller('api/v1/applications')
export class ApplicationJobController {
  constructor(
    private readonly applyJob: ApplyToJobUseCase,
    private readonly findOne: FindApplicationByIdUseCase,
    private readonly updateStatus: UpdateApplicationStatusUseCase,
    private readonly removeApplication: RemoveApplicationUseCase,
    private readonly fetchApplications: GetApplicationsForJobUseCase,
  ) {}

  @Post('company/:tenantId/apply-job')
  @UseGuards(JwtGuard, RolesGuard, TenantGuard)
  @Roles(Role.CANDIDATE)
  @UseInterceptors(
    FileInterceptor('resumeUrl', { storage: multer.memoryStorage() }),
  )
  async apply(
    @Body() dto: ApplyToJobHttpDto,
    @Tenant() tenantId: string,
    @GetProfile('sub') userId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const res = await this.applyJob.execute(dto, userId, tenantId, file);
    return ApplicationJobPersistenceMapper.toPersistence(res);
  }

  @Get('company/:tenantId/application/:id')
  @UseGuards(JwtGuard, TenantGuard)
  async singleApp(
    @Param('id') id: string,
    @Tenant() tenantId: string,
    @GetProfile('sub') userId: string,
  ) {
    const res = await this.findOne.execute(id, tenantId, userId);
    return ApplicationJobPersistenceMapper.toPersistence(res);
  }

  @Put('company/:tenantId/update-status/:id')
  @UseGuards(JwtGuard, TenantGuard)
  async update(
    @Param('id') id: string,
    @Body() body: { status: Status },
    @Tenant() tenantId: string,
    @GetProfile('sub') userId: string,
  ) {
    const res = await this.updateStatus.execute(
      id,
      body.status,
      tenantId,
      userId,
    );
    return ApplicationJobPersistenceMapper.toPersistence(res);
  }

  @Delete('company/:tenantId/remove-application/:id')
  @UseGuards(JwtGuard, TenantGuard)
  async remove(
    @Param('id') id: string,
    @Tenant() tenantId: string,
    @GetProfile('sub') userId: string,
  ) {
    await this.removeApplication.execute(id, tenantId, userId);
    return `Application successfully been removed`;
  }

  @Get('company/:tenantId/job-applications/:id')
  @UseGuards(JwtGuard, TenantGuard)
  async getApplications(
    @Param('id') id: string,
    @Tenant() tenantId: string,
    @GetProfile('sub') userId: string,
  ) {
    const apps = await this.fetchApplications.execute(id, tenantId, userId);
    return ApplicationJobPersistenceMapper.toPersistenceArray(apps);
  }
}

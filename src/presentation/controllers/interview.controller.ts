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
import { ScheduleInterviewUseCase } from 'src/application/use-cases/interview/schedule-interview.usecase';
import { ScheduleInterviewHttpDto } from '../dtos/interview/schedule-interview-http.dto';
import { InterviewPersistenceMapper } from '../../infrastructure/persistance/mappers/interview.mapper';
import { FindInterviewByIdUseCase } from 'src/application/use-cases/interview/find-interview.usecase';
import { UpdateInterviewFeedbackUseCase } from 'src/application/use-cases/interview/update-interview-feedback.usecase';
import { RemoveInterviewUseCase } from 'src/application/use-cases/interview/remove-interview.usecase';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { Tenant } from '../auth/decorators/tenant.decorator';
import { TenantGuard } from '../auth/guards/tenant.guard';
import { GetProfile } from '../auth/decorators/get-profile.decorator';

@Controller('api/v1/interviews')
export class InterviewControllers {
  constructor(
    private readonly scheduleInterview: ScheduleInterviewUseCase,
    private readonly getSingle: FindInterviewByIdUseCase,
    private readonly updateInterviewFeedback: UpdateInterviewFeedbackUseCase,
    private readonly deleteInterview: RemoveInterviewUseCase,
  ) {}

  @Post('company/:tenantId/schedule-interview')
  @UseGuards(JwtGuard, TenantGuard)
  async schedule(
    @Body() dto: ScheduleInterviewHttpDto,
    @Tenant() tenantId: string,
  ) {
    const res = await this.scheduleInterview.execute(dto, tenantId);
    return InterviewPersistenceMapper.toPersistence(res);
  }

  @Get('company/:tenantId/interview/:id')
  @UseGuards(JwtGuard, TenantGuard)
  async getInterview(@Param('id') id: string, @Tenant() tenantId: string) {
    const res = await this.getSingle.execute(id, tenantId);
    return InterviewPersistenceMapper.toPersistence(res);
  }

  @Put('company/:tenantId/interview/:id/update-feedback')
  @UseGuards(JwtGuard, TenantGuard)
  async updateFeedback(
    @Body() dto: { feedback: string; status: string },
    @Param('id') id: string,
    @Tenant() tenantId: string,
    @GetProfile('sub') userId: string,
  ) {
    const res = await this.updateInterviewFeedback.execute(
      id,
      dto.feedback,
      dto.status,
      tenantId,
      userId,
    );
    return InterviewPersistenceMapper.toPersistence(res);
  }

  @Delete('company/:tenantId/interview/:id')
  @UseGuards(JwtGuard, TenantGuard)
  async removeInterview(
    @Param('id') id: string,
    @Tenant() tenantId: string,
    @GetProfile('sub') userId: string,
  ) {
    await this.deleteInterview.execute(id, tenantId, userId);
    return `Successfully deleted this application interview`;
  }
}

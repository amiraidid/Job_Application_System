import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AddCommentUseCase } from 'src/application/use-cases/comments/add-comment.usecase';
import { CommentMapperPersistence } from 'src/infrastructure/persistance/mappers/comment.mapper';
import { AddCommentHttpDto } from '../dtos/comments/add-comment.dto';
import { GetApplicationCommentsUseCase } from 'src/application/use-cases/comments/get-application-comments.usecase';
import { GetCommentByIdUseCase } from 'src/application/use-cases/comments/get-comment-byId.usecase';
import { Tenant } from '../auth/decorators/tenant.decorator';
import { GetProfile } from '../auth/decorators/get-profile.decorator';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { TenantGuard } from '../auth/guards/tenant.guard';
import { RemoveCommentUseCase } from 'src/application/use-cases/comments/remove-comment.usecase';

@Controller('api/v1/comments')
export class CommentController {
  constructor(
    private readonly addComment: AddCommentUseCase,
    private readonly applicationComments: GetApplicationCommentsUseCase,
    private readonly getComments: GetCommentByIdUseCase,
    private readonly removeComment: RemoveCommentUseCase,
  ) {}

  @Post('company/:tenantId/add-comment')
  @UseGuards(JwtGuard, TenantGuard)
  async create(
    @Body() dto: AddCommentHttpDto,
    @Tenant() tenantId: string,
    @GetProfile('sub') userId: string,
  ) {
    const res = await this.addComment.execute(dto, tenantId, userId);
    return CommentMapperPersistence.toPersistence(res);
  }

  @Get('company/:tenantId/application/:id/comments')
  @UseGuards(JwtGuard, TenantGuard)
  async appsComeent(
    @Param('id') id: string,
    @Tenant() tenantId: string,
    @GetProfile('sub') userId: string,
  ) {
    const res = await this.applicationComments.execute(id, tenantId, userId);
    return CommentMapperPersistence.toPersistenceArray(res);
  }

  @Get('company/:tenantId/application/:appId/comment/:id')
  @UseGuards(JwtGuard, TenantGuard)
  async fetch(
    @Param('id') id: string,
    @Param('appId') appId: string,
    @Tenant() tenantId: string,
    @GetProfile('sub') userId: string,
  ) {
    const res = await this.getComments.execute(id, tenantId, userId, appId);
    return CommentMapperPersistence.toPersistence(res);
  }
  @Delete('company/:tenantId/comment/:id')
  @UseGuards(JwtGuard, TenantGuard)
  async remove(
    @Param('id') id: string,
    @Tenant() tenantId: string,
    @GetProfile('sub') userId: string,
  ) {
    const res = await this.removeComment.execute(id, tenantId, userId);
    return CommentMapperPersistence.toPersistence(res);
  }
}

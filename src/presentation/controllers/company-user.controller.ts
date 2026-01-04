import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AssignUserToCompanyUseCase } from 'src/application/use-cases/company-users/assign-user-to-company.usecase';
import { CompanyUsersMapperPersistence } from 'src/infrastructure/persistance/mappers/company-users.mapper';
import { AssignUserToCompanyHttpDto } from '../dtos/company-users/assign-users.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { TenantGuard } from '../auth/guards/tenant.guard';
import { Tenant } from '../auth/decorators/tenant.decorator';

@Controller('api/v1/company-users')
export class CompanyUsersController {
  constructor(private readonly assignUser: AssignUserToCompanyUseCase) {}

  @Post('company/:tenantId/assign')
  @UseGuards(JwtGuard, TenantGuard)
  async create(
    @Body() dto: AssignUserToCompanyHttpDto,
    @Tenant() tenantId: string,
  ) {
    const res = await this.assignUser.execut(dto, tenantId);
    return CompanyUsersMapperPersistence.toPersistence(res);
  }
}

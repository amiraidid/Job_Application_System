import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CreateCompanyUseCase } from 'src/application/use-cases/company/create-company.usecase';
import { CompanyMapperPersistence } from 'src/infrastructure/persistance/mappers/company-persistence.mapper';
import { CreateCompanyHttpDto } from '../dtos/company/create-company.dto';
import { GetCompanyByIdUseCase } from 'src/application/use-cases/company/get-company-byId.usecase';
import { GetProfile } from '../auth/decorators/get-profile.decorator';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { TenantGuard } from '../auth/guards/tenant.guard';

@Controller('api/v1/companies')
export class CompanyController {
  constructor(
    private readonly createCompany: CreateCompanyUseCase,
    private readonly getCompany: GetCompanyByIdUseCase,
  ) {}

  @Post('create-company')
  @UseGuards(JwtGuard, TenantGuard)
  async create(
    @Body() dto: CreateCompanyHttpDto,
    @GetProfile('sub') userId: string,
  ) {
    const res = await this.createCompany.execute(dto, userId);
    return CompanyMapperPersistence.toPersistence(res);
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  async fetch(@Param('id') id: string) {
    const res = await this.getCompany.execute(id);
    return CompanyMapperPersistence.toPersistence(res);
  }
}

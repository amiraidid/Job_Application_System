import { NotFoundError } from 'src/domain/core/errors/NotFoundError';
import { CompanyEntity } from 'src/domain/entities/company.entity';
import { ICompanyRepository } from 'src/domain/repositories/company.repository';

export class GetCompanyByIdUseCase {
  constructor(private readonly companyRepo: ICompanyRepository) {}

  async execute(companyId: string): Promise<CompanyEntity> {
    const company = await this.companyRepo.GetCompanyById(companyId);
    if (!company) {
      throw new NotFoundError(`Not found company with this ${companyId}`);
    }
    return company;
  }
}

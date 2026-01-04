import { CompanyEntity } from '../entities/company.entity';

export interface ICompanyRepository {
  CreateCompany(company: CompanyEntity, userId: string): Promise<CompanyEntity>;
  GetCompanyById(companyId: string): Promise<CompanyEntity>;
}

export const ICOMPANY_REPO = Symbol('ICOMPANY_REPO');

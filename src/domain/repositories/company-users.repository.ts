import { CompanyUsers } from '../entities/company-users.entity';

export interface ICompanyUsersRepository {
  AssignUserToCompany(comUser: CompanyUsers): Promise<CompanyUsers>;
}

export const ICOMPANYUSER_REPO = Symbol('ICOMPANYUSER_REPO');

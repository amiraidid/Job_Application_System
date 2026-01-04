import { NotFoundError } from 'src/domain/core/errors/NotFoundError';
import { ValidationError } from 'src/domain/core/errors/ValidationError';
import { CompanyUsers } from 'src/domain/entities/company-users.entity';
import { ICompanyUsersRepository } from 'src/domain/repositories/company-users.repository';
import { ICompanyRepository } from 'src/domain/repositories/company.repository';
import { IUserRepository } from 'src/domain/repositories/user.repository';

export class AssignUserToCompanyUseCase {
  constructor(
    private readonly companyUserRepo: ICompanyUsersRepository,
    private readonly companyRepo: ICompanyRepository,
    private readonly userRepo: IUserRepository,
  ) {}

  async execut(
    dto: { userId: string; role: string },
    companyId: string,
  ): Promise<CompanyUsers> {
    if (!dto.userId || !dto.role) {
      throw new ValidationError(`Please fill all required fields.`);
    }
    const company = await this.companyRepo.GetCompanyById(companyId);
    if (!company) {
      throw new NotFoundError(`Not found any Company with this ${companyId}`);
    }

    const user = await this.userRepo.FindUserById(dto.userId);
    if (!user) {
      throw new NotFoundError(`Not found any user with this ${dto.userId}`);
    }

    if (!['ADMIN', 'HR', 'INTERVIEWER', 'CANDIDATE'].includes(user.role)) {
      throw new NotFoundError(
        `The User Role is not assignable to this company`,
      );
    }

    const assignUser = new CompanyUsers(company.id, user.id, dto.role);
    if (!assignUser.isValid) {
      throw new NotFoundError('Sorry, the inserted data is invalid, try again');
    }
    const result = await this.companyUserRepo.AssignUserToCompany(assignUser);
    return result;
  }
}

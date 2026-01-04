import { NotFoundError } from 'src/domain/core/errors/NotFoundError';
import { CompanyEntity } from 'src/domain/entities/company.entity';
import { ICompanyRepository } from 'src/domain/repositories/company.repository';
import { IUserRepository } from 'src/domain/repositories/user.repository';

export class CreateCompanyUseCase {
  constructor(
    private readonly companyRepo: ICompanyRepository,
    private readonly userRepo: IUserRepository,
  ) {}

  async execute(
    dto: {
      name: string;
      description: string;
    },
    userId: string,
  ): Promise<CompanyEntity> {
    if (!dto.name || !dto.description) {
      throw new NotFoundError('Please, try to fill all the fields.');
    }

    const user = await this.userRepo.FindUserById(userId);
    if (!user) {
      throw new NotFoundError(`Not found any User with this ${userId}`);
    }

    const company = new CompanyEntity(dto.name, dto.description);
    if (!company.isValid) {
      throw new NotFoundError('Sorry, the inserted Data is invalid');
    }
    return this.companyRepo.CreateCompany(company, user.id);
  }
}

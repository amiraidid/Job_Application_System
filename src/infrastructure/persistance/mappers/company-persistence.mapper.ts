import { CompanyEntity } from 'src/domain/entities/company.entity';

export class CompanyMapperPersistence {
  static toDomain(raw: {
    id: string;
    name: string;
    description: string;
    companyUsers: [{ userId: string; name: string; role: string }];
    createdAt: Date;
  }) {
    const company = new CompanyEntity(raw.name, raw.description);
    (company.id as any) = raw.id;
    (company.companyUsers as any) = raw.companyUsers.map((cu) => ({
      name: cu.name,
      role: cu.role,
      userId: cu.userId,
    }));
    (company.createdAt as any) = raw.createdAt;
    return company;
  }

  static toPersistence(company: CompanyEntity) {
    return {
      id: company.id,
      name: company.name,
      description: company.description,
      companyUsers: company.companyUsers.map((cu) => ({
        name: cu.name,
        role: cu.role,
        userId: cu.userId,
      })),
      createdAt: company.createdAt,
    };
  }
}

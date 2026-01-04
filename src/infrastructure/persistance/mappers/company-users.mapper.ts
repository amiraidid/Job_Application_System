import { CompanyUsers } from 'src/domain/entities/company-users.entity';

export class CompanyUsersMapperPersistence {
  static toDomain(raw: {
    id: string;
    companyId: string;
    userId: string;
    role: string;
    user: {
      name: string;
      email: string;
      role: string;
    };
    company: {
      name: string;
      description: string;
    };
    createdAt: Date;
  }) {
    const assignUser = new CompanyUsers(raw.companyId, raw.userId, raw.role);
    (assignUser.id as any) = raw.id;
    (assignUser.createdAt as any) = raw.createdAt;
    (assignUser.company as any) = raw.company;
    (assignUser.user as any) = raw.user;
    return assignUser;
  }

  static toPersistence(comUser: CompanyUsers) {
    return {
      id: comUser.id,
      companyId: comUser.companyId,
      userId: comUser.userId,
      company: comUser.company
        ? {
            name: comUser.company.name,
            description: comUser.company.description,
          }
        : undefined,
      users: comUser.user
        ? {
            name: comUser.user.name,
            email: comUser.user.email,
            role: comUser.user.role,
          }
        : undefined,
      createdAt: comUser.createdAt,
    };
  }
}

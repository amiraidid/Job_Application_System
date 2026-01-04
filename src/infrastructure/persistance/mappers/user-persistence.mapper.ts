import { UserEntity } from 'src/domain/entities/user.entity';

export class UserPersistenceMapper {
  static toDomain(raw: {
    id: string;
    name: string;
    email: string;
    password: string;
    role: string;
    companyUsers?: { companyId: string; role: string }[];
    createdAt: Date;
  }) {
    const user = new UserEntity(raw.name, raw.email, raw.password);

    (user.id as any) = raw.id;
    (user.role as any) = raw.role;
    (user.companyUsers as any) = raw.companyUsers;
    (user.createdAt as any) = raw.createdAt;
    return user;
  }

  static toPersistence(user: UserEntity) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      companyUsers: user.companyUsers
        ? {
            companyId: user.companyUsers.map((co) => co.companyId),
            role: user.companyUsers.map((co) => co.role),
          }
        : undefined,
      createdAt: user.createdAt,
    };
  }

  static toObject(user: UserEntity, token: string) {
    return {
      ...user,
      token: token,
    };
  }
}

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CompanyUsers } from 'src/domain/entities/company-users.entity';
import { ICompanyUsersRepository } from 'src/domain/repositories/company-users.repository';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { CompanyUsersMapperPersistence } from '../mappers/company-users.mapper';
import { TenantUserRole } from 'src/domain/enums/tenant-user.enums';

@Injectable()
export class CompanyUserPrismaRepository implements ICompanyUsersRepository {
  constructor(private prisma: PrismaService) {}

  async AssignUserToCompany(comUser: CompanyUsers): Promise<CompanyUsers> {
    try {
      const assign_user = await this.prisma.companyUser.create({
        data: {
          companyId: comUser.companyId,
          userId: comUser.userId,
          role: comUser.role as unknown as TenantUserRole,
        },
        include: { company: true, user: true },
      });
      if (!assign_user) {
        throw new ConflictException(
          `Failed to Assign this user with ${comUser.userId} to this company with ${comUser.companyId}`,
        );
      }

      return CompanyUsersMapperPersistence.toDomain(assign_user);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}

/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { CompanyEntity } from 'src/domain/entities/company.entity';
import { ICompanyRepository } from 'src/domain/repositories/company.repository';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { CompanyMapperPersistence } from '../mappers/company-persistence.mapper';
import { NotFoundError } from 'src/domain/core/errors/NotFoundError';
import { InternalServerError } from 'src/domain/core/errors/InternalServerError';
import { ConflictError } from 'src/domain/core/errors/ConflictError';

@Injectable()
export class CompanyPrismaRepository implements ICompanyRepository {
  constructor(private prisma: PrismaService) {}

  async CreateCompany(
    company: CompanyEntity,
    userId: string,
  ): Promise<CompanyEntity> {
    try {
      const result = await this.prisma.$transaction(async (tx) => {
        const create_company = await tx.company.create({
          data: {
            name: company.name,
            description: company.description,
            companyUsers: {
              create: {
                userId,
                role: 'ADMIN',
              },
            },
          },
          include: { companyUsers: true },
        });

        if (!create_company) {
          throw new ConflictError(
            `Failed to create a new Company, please try again`,
          );
        }

        return create_company;
      });

      return CompanyMapperPersistence.toDomain(result as any);
    } catch (error) {
      throw new InternalServerError(error.message);
    }
  }

  async GetCompanyById(companyId: string): Promise<CompanyEntity> {
    try {
      const company = await this.prisma.company.findUnique({
        where: { id: companyId },
        include: { companyUsers: true },
      });

      if (!company) {
        throw new NotFoundError(`Not found a company with this ${companyId}`);
      }
      return CompanyMapperPersistence.toDomain(company as any);
    } catch (error) {
      throw new InternalServerError(error.message);
    }
  }
}

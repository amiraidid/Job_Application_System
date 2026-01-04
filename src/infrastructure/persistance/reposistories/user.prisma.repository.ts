/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UserEntity } from 'src/domain/entities/user.entity';
import { IUserRepository } from 'src/domain/repositories/user.repository';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { UserPersistenceMapper } from '../mappers/user-persistence.mapper';

@Injectable()
export class UserPrismaRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async FindUserByEmail(email: string): Promise<UserEntity> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: email },
      });
      if (!user) {
        throw new NotFoundException(
          `Sorry, Did not Find any user with this ${email} in the DB`,
        );
      }
      return UserPersistenceMapper.toDomain(user);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async RegisterUser(user: UserEntity): Promise<UserEntity> {
    try {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: user.email },
        include: { companyUsers: true },
      });

      if (existingUser) {
        throw new NotFoundException(
          `Found a User who associeted with this email: ${user.email}`,
        );
      }

      const create_user = await this.prisma.user.create({
        data: {
          name: user.name,
          email: user.email,
          password: user.password,
        },
      });

      return UserPersistenceMapper.toDomain(create_user);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async FindUserById(id: string): Promise<UserEntity> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: id },
        include: { companyUsers: true },
      });

      if (!user) {
        throw new NotFoundException(`Not Found any User with this : ${id}`);
      }
      return UserPersistenceMapper.toDomain(user);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}

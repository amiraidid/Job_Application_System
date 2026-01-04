import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma.module';
import { UserController } from '../controllers/user.controller';
import {
  IUserRepository,
  USER_REPOSITORY,
} from 'src/domain/repositories/user.repository';
import { UserPrismaRepository } from 'src/infrastructure/persistance/reposistories/user.prisma.repository';
import { RegisterUserUseCase } from 'src/application/use-cases/users/register-user.usecase';
import { BcryptHasher } from 'src/infrastructure/services/bcrypt-hasher';
import { IHasher_REPO } from 'src/domain/services/hasher.interface';
import { LoginUserUseCase } from 'src/application/use-cases/users/login-user.usecase';
import { ITokenService_REPO } from 'src/domain/services/token.interface';
import { JwtTokenService } from 'src/infrastructure/services/jwt-token.service';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { RolesGuard } from '../auth/guards/roles.guard';
import { FindUserByEmailUseCase } from 'src/application/use-cases/users/find-user-by-email.usecase';
import { FindUserByIdUseCase } from 'src/application/use-cases/users/find-user-by-id.usecase';

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [
    JwtStrategy,
    RolesGuard,
    {
      provide: USER_REPOSITORY,
      useClass: UserPrismaRepository,
    },
    {
      provide: IHasher_REPO,
      useClass: BcryptHasher,
    },
    {
      provide: ITokenService_REPO,
      useClass: JwtTokenService,
    },
    {
      provide: RegisterUserUseCase,
      useFactory: (repo: IUserRepository, hashingPassword: BcryptHasher) =>
        new RegisterUserUseCase(repo, hashingPassword),
      inject: [USER_REPOSITORY, IHasher_REPO],
    },
    {
      provide: LoginUserUseCase,
      useFactory: (
        repo: IUserRepository,
        hashingPassword: BcryptHasher,
        tokenService: JwtTokenService,
      ) => new LoginUserUseCase(repo, hashingPassword, tokenService),
      inject: [USER_REPOSITORY, IHasher_REPO, ITokenService_REPO],
    },
    {
      provide: FindUserByEmailUseCase,
      useFactory: (repo: IUserRepository) => new FindUserByEmailUseCase(repo),
      inject: [USER_REPOSITORY],
    },
    {
      provide: FindUserByIdUseCase,
      useFactory: (repo: IUserRepository) => new FindUserByIdUseCase(repo),
      inject: [USER_REPOSITORY],
    },
  ],
})
export class UserModule {}

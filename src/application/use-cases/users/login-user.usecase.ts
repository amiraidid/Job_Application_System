import { NotFoundError } from 'src/domain/core/errors/NotFoundError';
import { UnauthorizedError } from 'src/domain/core/errors/UnauthorizedError';
import { UserEntity } from 'src/domain/entities/user.entity';
import { IUserRepository } from 'src/domain/repositories/user.repository';
import { IHasher } from 'src/domain/services/hasher.interface';
import { ITokenService } from 'src/domain/services/token.interface';

export class LoginUserUseCase {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly hasher: IHasher,
    private readonly tokenService: ITokenService,
  ) {}

  async execute(dto: {
    email: string;
    password: string;
  }): Promise<{ user: UserEntity; token: string }> {
    const user = await this.userRepo.FindUserByEmail(dto.email);
    if (!user) {
      throw new NotFoundError(
        `Sorry, Did not Find any user with this ${dto.email}`,
      );
    }

    const match = await this.hasher.compare(dto.password, user.password);
    if (!match) throw new UnauthorizedError('Invalid credentials');

    const token = this.tokenService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
      companyId: user.companyId,
    });

    return { user, token };
  }
}

import { NotFoundError } from 'src/domain/core/errors/NotFoundError';
import { UserEntity } from 'src/domain/entities/user.entity';
import { IUserRepository } from 'src/domain/repositories/user.repository';

export class FindUserByEmailUseCase {
  constructor(private readonly userRepo: IUserRepository) {}

  async execute(email: string): Promise<UserEntity> {
    const user = await this.userRepo.FindUserByEmail(email);

    if (!user) {
      throw new NotFoundError(
        `Sorry, Did not Find any user with this ${email}`,
      );
    }

    return user;
  }
}

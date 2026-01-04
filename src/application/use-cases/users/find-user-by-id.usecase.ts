import { NotFoundError } from 'src/domain/core/errors/NotFoundError';
import { UserEntity } from 'src/domain/entities/user.entity';
import { IUserRepository } from 'src/domain/repositories/user.repository';

export class FindUserByIdUseCase {
  constructor(private readonly userRepo: IUserRepository) {}

  async execute(id: string): Promise<UserEntity> {
    if (!id) throw new NotFoundError(`Not found a user with this ${id}`);

    const user = await this.userRepo.FindUserById(id);
    return user;
  }
}

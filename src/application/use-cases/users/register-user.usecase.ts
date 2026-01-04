import { RegisterUserApplicationDto } from 'src/application/dtos/user-dtos/register-user.dto';
import { ValidationError } from 'src/domain/core/errors/ValidationError';
import { UserEntity } from 'src/domain/entities/user.entity';
import { IUserRepository } from 'src/domain/repositories/user.repository';
import { IHasher } from 'src/domain/services/hasher.interface';

export class RegisterUserUseCase {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly hasher: IHasher,
  ) {}

  async execute(dto: RegisterUserApplicationDto): Promise<UserEntity> {
    const { name, email, password } = dto;
    if (!name || !email || !password) {
      throw new ValidationError('Please make sure you fill all the fields.');
    }

    const hashed = await this.hasher.hash(password);
    const user = new UserEntity(name, email, hashed);

    if (!user.isValid()) {
      throw new ValidationError(
        'Sorry, Your Inserted Data is Invalid, Please try again',
      );
    }

    const register = await this.userRepo.RegisterUser(user);
    return register;
  }
}

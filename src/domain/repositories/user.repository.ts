import { UserEntity } from '../entities/user.entity';

export interface IUserRepository {
  RegisterUser(user: UserEntity): Promise<UserEntity>;
  FindUserByEmail(email: string): Promise<UserEntity>;
  FindUserById(id: string): Promise<UserEntity>;
}

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

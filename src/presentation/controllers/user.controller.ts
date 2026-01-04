import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { RegisterUserUseCase } from 'src/application/use-cases/users/register-user.usecase';
import { RegisterUserPresentationDto } from '../dtos/user-presentation/register-user-presentation.dto';
import { UserPersistenceMapper } from 'src/infrastructure/persistance/mappers/user-persistence.mapper';
import { LoginUserUseCase } from 'src/application/use-cases/users/login-user.usecase';
import { LoginUserPresentationDto } from '../dtos/user-presentation/login-user-presentation.dto';
import { FindUserByEmailUseCase } from 'src/application/use-cases/users/find-user-by-email.usecase';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { ApiBearerAuth, ApiProperty, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

@Controller('api/v1/users')
export class UserController {
  constructor(
    private readonly registerUser: RegisterUserUseCase,
    private readonly loginUser: LoginUserUseCase,
    private readonly findUser: FindUserByEmailUseCase,
  ) {}

  @Post('register-user')
  async create(@Body() dto: RegisterUserPresentationDto) {
    const res = await this.registerUser.execute(dto);
    return UserPersistenceMapper.toPersistence(res);
  }

  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Post('login-user')
  async login(@Body() dto: LoginUserPresentationDto) {
    const res = await this.loginUser.execute(dto);
    return res;
  }

  @ApiBearerAuth('access-token')
  @ApiTags('Users')
  @UseGuards(JwtGuard)
  @ApiProperty({ example: 'example123@gmail.com' })
  @Get('find-user')
  async getUser(@Body() email: string) {
    const res = await this.findUser.execute(email);
    return UserPersistenceMapper.toPersistence(res);
  }
}

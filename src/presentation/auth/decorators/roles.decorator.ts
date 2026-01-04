import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/domain/enums/user-roles.enum';

export const RolesKey = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(RolesKey, roles);

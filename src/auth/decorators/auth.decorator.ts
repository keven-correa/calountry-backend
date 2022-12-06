import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserRoleGuard } from '../guards/user-role.guard';
import { UserRoles } from '../enums/user.roles';
import { RolProtected } from './rol-protected.decorator';

export function Auth(...roles: UserRoles[]) {
  return applyDecorators(
    RolProtected(...roles),
    UseGuards(AuthGuard(), UserRoleGuard),
  );
}

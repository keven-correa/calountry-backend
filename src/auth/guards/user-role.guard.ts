import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { META_ROLES } from '../decorators/rol-protected.decorator'; //TODO: Crear index.ts
import { UserRoles } from '../enums/user.roles';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const validRole: UserRoles = this.reflector.get(
      META_ROLES,
      context.getHandler(),
    );
    if (!validRole) return true;
    const req = context.switchToHttp().getRequest();
    const user = req.user;
    if (!user) throw new BadRequestException();
    if (validRole.includes(user.role)) {
      return true;
    }
    // console.log({validRole: user.role});
    throw new ForbiddenException(`User ${user.user_name} need a valid role`);
  }
}

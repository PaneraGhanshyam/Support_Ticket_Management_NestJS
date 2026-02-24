import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleName } from '../../roles/entities/role.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context:ExecutionContext): boolean{
    const requiredRoles=this.reflector.getAllAndOverride<RoleName[]>(
      'roles',
      [context.getHandler(), context.getClass()],
    );

    if(!requiredRoles) return true;

    const {user} = context.switchToHttp().getRequest();

    const hasRole = requiredRoles.includes(user.role?.name);

    if(!hasRole){
      throw new ForbiddenException(
        'You do not have permision to access this resource',
      );
    }

    return true;
  }
}

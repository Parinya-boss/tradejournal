import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { UserRole } from '../../entities/user.entity';

@Injectable()
export class CustomerGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{
      user?: { role: UserRole };
    }>();
    return request.user?.role === UserRole.CUSTOMER;
  }
}

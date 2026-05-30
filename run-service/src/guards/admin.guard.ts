import { Injectable, CanActivate, ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('Unauthorized. Administrative token is missing.');
    }

    if (user.role !== 'ADMIN') {
      throw new ForbiddenException( 'Forbidden. Only ADMIN can access this endpoint.');
    }

    return true;
  }
}
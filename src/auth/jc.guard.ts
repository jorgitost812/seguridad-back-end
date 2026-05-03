import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class JcGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('No autenticado');
    }

    const userJcId = user.jcId;

    if (!userJcId) {
      throw new ForbiddenException('No tienes un JC asignado');
    }

    request.userJcId = userJcId;
    return true;
  }
}
import { Injectable, CanActivate, ExecutionContext, ForbiddenException, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      this.logger.warn('Unauthenticated access attempt to protected route');
      throw new ForbiddenException('No autenticado');
    }

    const userRole = user.rol?.nombre || user.rol;
    const hasRole = requiredRoles.includes(userRole);

    if (!hasRole) {
      this.logger.warn(
        `Unauthorized role access: user="${user.email}" required="${requiredRoles.join(', ')}"`,
      );
      throw new ForbiddenException(`No tienes permiso. Rol requerido: ${requiredRoles.join(', ')}`);
    }

    this.logger.debug(`Authorized access: user="${user.email}" role="${userRole}"`);
    return true;
  }
}
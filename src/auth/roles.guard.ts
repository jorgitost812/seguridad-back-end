import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    console.log('=== RolesGuard ===');
    console.log('Usuario completo:', user);
    console.log('user.rol:', user?.rol);
    console.log('user.rol.nombre:', user?.rol?.nombre);
    console.log('requiredRoles:', requiredRoles);

    if (!user) {
      throw new ForbiddenException('No autenticado');
    }

    const userRole = user.rol?.nombre || user.rol;
    console.log('userRole calculado:', userRole);
    
    const hasRole = requiredRoles.includes(userRole);
    console.log('hasRole:', hasRole);

    if (!hasRole) {
      throw new ForbiddenException(`No tienes permiso. Rol requerido: ${requiredRoles.join(', ')}`);
    }

    return true;
  }
}
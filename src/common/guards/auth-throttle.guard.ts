import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ExecutionContext } from '@nestjs/common';
import { CanActivate } from '@nestjs/common';

interface RateLimitStore {
  [key: string]: {
    attempts: number;
    firstAttempt: number;
    resetTime: number;
  };
}

@Injectable()
export class AuthThrottleGuard implements CanActivate {
  private store: RateLimitStore = {};
  private readonly MAX_LOGIN_ATTEMPTS = 5;
  private readonly LOGIN_WINDOW = 15 * 60 * 1000; // 15 minutos
  private readonly MAX_REGISTER_ATTEMPTS = 3;
  private readonly REGISTER_WINDOW = 60 * 60 * 1000; // 1 hora

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const endpoint = request.path;
    const clientIp = this.getClientIp(request);

    if (endpoint.includes('login')) {
      return this.checkRateLimit(
        `login:${clientIp}`,
        this.MAX_LOGIN_ATTEMPTS,
        this.LOGIN_WINDOW,
        'Demasiados intentos de login. Intenta más tarde.'
      );
    }

    if (endpoint.includes('register')) {
      return this.checkRateLimit(
        `register:${clientIp}`,
        this.MAX_REGISTER_ATTEMPTS,
        this.REGISTER_WINDOW,
        'Demasiados registros desde esta IP. Intenta más tarde.'
      );
    }

    return true;
  }

  private checkRateLimit(
    key: string,
    maxAttempts: number,
    window: number,
    errorMessage: string
  ): boolean {
    const now = Date.now();
    const record = this.store[key];

    if (!record) {
      // Primer intento
      this.store[key] = {
        attempts: 1,
        firstAttempt: now,
        resetTime: now + window,
      };
      return true;
    }

    if (now > record.resetTime) {
      // Ventana expirada, reiniciar
      this.store[key] = {
        attempts: 1,
        firstAttempt: now,
        resetTime: now + window,
      };
      return true;
    }

    // Dentro de la ventana
    if (record.attempts >= maxAttempts) {
      const remainingTime = Math.ceil((record.resetTime - now) / 1000);
      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          message: errorMessage,
          retryAfter: remainingTime,
        },
        HttpStatus.TOO_MANY_REQUESTS
      );
    }

    record.attempts++;
    return true;
  }

  private getClientIp(request: any): string {
    return (
      request.headers['x-forwarded-for']?.split(',')[0].trim() ||
      request.socket?.remoteAddress ||
      'unknown'
    );
  }
}

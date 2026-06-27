import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { DataSource, QueryRunner } from 'typeorm';
import { Reflector } from '@nestjs/core';
import {
  TRANSACTIONAL_KEY,
  TransactionalOptions,
} from '../decorators/transactional.decorator';

/**
 * Interceptor que maneja automáticamente transacciones en métodos decorados con @Transactional()
 */
@Injectable()
export class TransactionalInterceptor implements NestInterceptor {
  private readonly logger = new Logger(TransactionalInterceptor.name);

  constructor(
    private readonly dataSource: DataSource,
    private readonly reflector: Reflector,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const options = this.reflector.get<TransactionalOptions>(
      TRANSACTIONAL_KEY,
      context.getHandler(),
    );

    // Si no tiene el decorator, pasar directamente
    if (!options) {
      return next.handle();
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    // Iniciar transacción
    await queryRunner.startTransaction(
      (options.isolationLevel as any).replace('_', ' '),
    );

    // Inyectar queryRunner en el request para que lo use el servicio
    const request = context.switchToHttp().getRequest();
    request.queryRunner = queryRunner;

    return next.handle().pipe(
      tap(async () => {
        // Commit en caso de éxito
        try {
          await queryRunner.commitTransaction();
          this.logger.debug('Transacción completada exitosamente');
        } catch (commitError) {
          this.logger.error('Error al hacer commit:', commitError);
          throw commitError;
        }
      }),
      catchError(async (error) => {
        // Rollback en caso de error
        try {
          await queryRunner.rollbackTransaction();
          this.logger.error('Transacción revertida por error:', error.message);
        } catch (rollbackError) {
          this.logger.error('Error al hacer rollback:', rollbackError);
        }
        return throwError(() => error);
      }),
    );
  }
}

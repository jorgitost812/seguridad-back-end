import { applyDecorators, SetMetadata } from '@nestjs/common';

/**
 * Decorator para marcar métodos que requieren transacción de base de datos.
 * 
 * Uso:
 * @Transactional()
 * async create(createDto: CreateDto) {
 *   // El QueryRunner será inyectado automáticamente
 * }
 * 
 * @param isolationLevel - Nivel de aislamiento de la transacción (DEFAULT, READ_UNCOMMITTED, READ_COMMITTED, REPEATABLE_READ, SERIALIZABLE)
 */
export const TRANSACTIONAL_KEY = 'transactional';

export interface TransactionalOptions {
    isolationLevel?: 'READ_UNCOMMITTED' | 'READ_COMMITTED' | 'REPEATABLE_READ' | 'SERIALIZABLE';
}

export function Transactional(options: TransactionalOptions = {}): MethodDecorator {
    return applyDecorators(
        SetMetadata(TRANSACTIONAL_KEY, options)
    );
}

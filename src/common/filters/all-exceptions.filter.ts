import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);
  private readonly isDevelopment = process.env.NODE_ENV !== 'production';

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Error interno del servidor';
    let errors: any = undefined;

    // Manejar HttpException
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object') {
        const { message: msg, error } = exceptionResponse as any;
        message = msg || exception.message;
        errors = error;
      } else {
        message = exceptionResponse as string;
      }

      // Log seguro de excepciones HTTP
      this.logError(request, exception, status);
    } else if (exception instanceof Error) {
      // Manejar errores normales de JavaScript
      message = this.isDevelopment
        ? exception.message
        : 'Error interno del servidor';

      this.logError(request, exception, status);
    } else {
      // Errores desconocidos
      this.logger.error(
        `Unknown error: ${JSON.stringify(exception)}`,
        'AllExceptionsFilter',
      );
    }

    const responseBody = {
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
      ...(this.isDevelopment && { errors }),
      ...(this.isDevelopment && { stack: exception instanceof Error ? exception.stack : undefined }),
    };

    // Remover null/undefined en modo producción
    if (!this.isDevelopment) {
      Object.keys(responseBody).forEach(
        key => responseBody[key] === undefined && delete responseBody[key],
      );
    }

    response.status(status).json(responseBody);
  }

  private logError(request: any, exception: Error | HttpException, status: number) {
    const method = request.method;
    const url = request.url;
    const message = exception.message;

    // Log diferenciado por severidad
    if (status >= 500) {
      this.logger.error(
        `[${method}] ${url} - ${message}`,
        exception instanceof Error ? exception.stack : '',
        'AllExceptionsFilter',
      );
    } else if (status >= 400) {
      this.logger.warn(
        `[${method}] ${url} - ${message}`,
        'AllExceptionsFilter',
      );
    } else {
      this.logger.log(
        `[${method}] ${url} - ${message}`,
        'AllExceptionsFilter',
      );
    }
  }
}

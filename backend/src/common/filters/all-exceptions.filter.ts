import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError, EntityNotFoundError, TypeORMError } from 'typeorm';
import { LoggerService } from '../../common/logger/logger.service';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: number = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | object | string[] = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (
        status === HttpStatus.BAD_REQUEST &&
        typeof exceptionResponse === 'object' &&
        'message' in exceptionResponse &&
        Array.isArray((exceptionResponse as any).message)
      ) {
        message = (exceptionResponse as any).message;
      } else {
        message = exceptionResponse;
      }
    } else if (exception instanceof QueryFailedError) {
      status = HttpStatus.BAD_REQUEST;
      const dbError = exception as any;
      let userMessage = 'An error occurred while processing your request';

      switch (dbError.code) {
        case '23505':
        case 'ER_DUP_ENTRY':
          userMessage =
            'This value is already in use. Please choose a different one.';
          const field = dbError.detail?.match(/Key \((.*?)\)=/)?.[1];
          if (field) {
            userMessage = `${field} is already in use. Please choose a different ${field}.`;
          }
          break;
        case '23503':
          userMessage =
            'Invalid reference provided. The related record does not exist.';
          break;
        default:
          userMessage = 'Invalid data provided.';
      }

      message = {
        error: userMessage,
        detail: dbError.message,
        code: dbError.code,
      };
    } else if (exception instanceof EntityNotFoundError) {
      status = HttpStatus.NOT_FOUND;
      message = {
        error: 'The requested resource was not found.',
        detail: (exception as any).message,
      };
    } else if (exception instanceof TypeORMError) {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = {
        error: 'A database error occurred. Please try again later.',
        detail: (exception as any).message,
      };
    } else if (exception instanceof Error) {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = {
        error: 'An unexpected error occurred. Please try again.',
        detail: exception.message,
      };
    }

    if (status >= 400) {
      this.logger.error(
        `[${request.method}] ${request.url} - ${status}: ${JSON.stringify(message)}`,
        exception instanceof Error ? exception.stack : undefined,
      );
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}

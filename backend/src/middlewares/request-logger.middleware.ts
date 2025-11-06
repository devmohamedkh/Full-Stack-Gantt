import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoggerService } from '../common/logger/logger.service';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: LoggerService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;
    const startTime = Date.now();

    this.logger.info({
      type: 'request',
      method,
      url: originalUrl,
    });

    res.on('finish', () => {
      const duration = Date.now() - startTime;
      const statusCode = res.statusCode;

      this.logger.info({
        type: 'response',
        method,
        url: originalUrl,
        status: statusCode,
        duration,
      });
    });

    next();
  }
}

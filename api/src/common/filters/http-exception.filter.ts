import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import {
  ApiErrorResponse,
  ErrorDetail,
} from '../interfaces/api-response.interface';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let code: string | number = 'INTERNAL_SERVER_ERROR';
    const details: ErrorDetail[] = [];

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      code = HttpStatus[status] || status;
      const res = exception.getResponse();

      if (typeof res === 'string') {
        details.push({ message: res });
      } else if (typeof res === 'object' && res !== null) {
        const responseObj = res as Record<string, any>;

        if (Array.isArray(responseObj.message)) {
          // Process class-validator validation messages
          responseObj.message.forEach((msg: string) => {
            const firstSpace = msg.indexOf(' ');
            const field =
              firstSpace > 0 ? msg.substring(0, firstSpace) : undefined;
            details.push({
              field,
              message: msg,
            });
          });
        } else if (responseObj.message) {
          details.push({
            message: String(responseObj.message),
          });
        } else {
          details.push({
            message: exception.message || 'Error occurred',
          });
        }
      }
    } else {
      this.logger.error('Unhandled exception:', exception);
      details.push({ message: 'An internal server error occurred' });
    }

    const errorPayload: ApiErrorResponse = {
      success: false,
      error: {
        code,
        details,
      },
      timestamp: new Date().toISOString(),
    };

    response.status(status).json(errorPayload);
  }
}

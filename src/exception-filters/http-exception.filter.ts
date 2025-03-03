import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

interface HttpExceptionResponse {
  message: string | string[];
  [key: string]: any;
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse() as HttpExceptionResponse;

    response.status(status).json({
      statusCode: status,
      message: `${request.method} ${exception.message}`,
      data: {},
      errors: Array.isArray(exceptionResponse.message)
        ? exceptionResponse.message
        : [exceptionResponse.message],
    });
  }
}

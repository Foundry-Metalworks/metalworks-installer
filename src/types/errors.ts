import { HttpStatusCodes } from '@/constants/http';

class RouteError extends Error {
  public statusCode: HttpStatusCodes;

  public constructor(statusCode: number, message: string, stack?: unknown) {
    super(message);
    this.name = 'RouteError';
    this.stack = JSON.stringify(stack);
    this.statusCode = statusCode;
  }
}

export { RouteError };

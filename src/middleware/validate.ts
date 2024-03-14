import { validationResult } from 'express-validator';
import { HttpStatusCodes } from '@/constants/http';
import { NextFunction, Request, Response } from 'express';
import { RouteError } from '@/types/errors';

const validate = (req: Request, res: Response, next: NextFunction) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    throw new RouteError(
      HttpStatusCodes.BAD_REQUEST,
      'Failed parameter validation',
      result.array(),
    );
  }
  next();
};

export default validate;

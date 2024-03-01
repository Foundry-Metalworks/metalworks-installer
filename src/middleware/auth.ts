import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { RouteError } from '@/types/errors';
import { HttpStatusCodes } from '@/constants/http';
import env from '@/constants/env';

const validateToken: RequestHandler = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    throw new RouteError(HttpStatusCodes.FORBIDDEN, 'Must include Bearer token');
  }
  const token = authHeader.substring(7);
  const validated = jwt.verify(token, env.MetalworksPublicKey);
  if (validated) {
    return next();
  } else throw new RouteError(HttpStatusCodes.FORBIDDEN, 'Invalid Bearer token');
};

export { validateToken };

import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { RouteError } from '@/types/errors';
import { HttpStatusCodes } from '@/constants/http';
import key from '@/constants/key';
import env from '@/constants/env';
import { NodeEnvs } from '@/constants/misc';

const validateToken: RequestHandler = (req, res, next) => {
  if (env.NodeEnv === NodeEnvs.Dev.valueOf()) return next();
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    throw new RouteError(HttpStatusCodes.FORBIDDEN, 'Must include Bearer token');
  }
  const token = authHeader.substring(7);
  const validated = jwt.verify(token, key.publicKey);
  if (validated) {
    return next();
  } else throw new RouteError(HttpStatusCodes.FORBIDDEN, 'Invalid Bearer token');
};

export { validateToken };

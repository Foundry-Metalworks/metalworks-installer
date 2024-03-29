import 'express-async-errors';

import morgan from 'morgan';
import helmet from 'helmet';
import express, { Request, Response, NextFunction } from 'express';
import logger from 'jet-logger';

import EnvVars from '@/constants/env';
import { HttpStatusCodes } from '@/constants/http';
import { NodeEnvs } from '@/constants/misc';
import { RouteError } from '@/types/errors';
import routes from './routes';
import path from 'path';
import swaggerUI from 'swagger-ui-express';
import swaggerDocument from './swagger.json';

// **** Variables **** //

const app = express();

// **** Setup **** //

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Show routes called in console during development
if (EnvVars.NodeEnv === NodeEnvs.Dev.valueOf()) {
  app.use(morgan('dev'));
}

// Security
if (EnvVars.NodeEnv === NodeEnvs.Production.valueOf()) {
  app.use(helmet());
}

// Swagger
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));
// Routes
app.use('/api/v1', routes);

// Views
app.use(express.static(path.join(__dirname, './public')));

// Add error handler
app.use(
  (
    err: Error,
    _req: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _next: NextFunction,
  ) => {
    if (EnvVars.NodeEnv !== NodeEnvs.Test.valueOf()) {
      logger.err(err, true);
    }
    let status = HttpStatusCodes.BAD_REQUEST;
    if (err instanceof RouteError) {
      status = err.statusCode;
    }
    return res.status(status).json({ error: err.message, stack: err.stack });
  },
);

// **** Export default **** //

export default app;

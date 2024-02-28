import { Request, Response, NextFunction } from 'express';
import { clerkClient, RequireAuthProp } from '@clerk/clerk-sdk-node';
import env from '@/constants/env';
import { RouteError } from '@/types/errors';
import { HttpStatusCodes } from '@/constants/http';

export declare type Middleware = (req: Request, res: Response, next: NextFunction) => void;
type UserMetadata = {
  servers: string[];
};

const requireInServer: Middleware = async (req, res, next) => {
  const userId = (req as RequireAuthProp<Request>).auth.userId;
  const user = await clerkClient.users.getUser(userId);
  const metadata: UserMetadata = user.publicMetadata as UserMetadata;
  if (metadata.servers.includes(env.Name)) {
    return next();
  } else throw new RouteError(HttpStatusCodes.UNAUTHORIZED, 'User not in this group');
};

export { requireInServer };

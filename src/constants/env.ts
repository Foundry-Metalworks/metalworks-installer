/* eslint-disable n/no-process-env */

import * as dotenv from 'dotenv';
import { parse } from 'ts-command-line-args';
import path from 'path';
import * as process from 'process';

interface IArgs {
  env: string;
}

// **** Setup **** //

// Command line arguments
const args = parse<IArgs>({
  env: {
    type: String,
    defaultValue: 'development',
    alias: 'e',
  },
});

const dotEnvPath = path.join(__dirname, `../../env/${args.env}.env`);
dotenv.config({
  path: dotEnvPath,
});

const variables = {
  NodeEnv: process.env.NODE_ENV ?? '',
  Port: process.env.PORT ?? 0,
  Name: process.env.DOMAIN_NAME ?? '',
  DigitalOceanKey: process.env.DIGITALOCEAN_API_KEY ?? '',
  ClerkKey: process.env.CLERK_SECRET_KEY ?? '',
} as const;

export default variables;

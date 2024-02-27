/* eslint-disable n/no-process-env */

import * as dotenv from 'dotenv';
import { parse } from 'ts-command-line-args';
import path from 'path';

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

const dotEnvPath =
  args.env === 'development'
    ? path.join(__dirname, `../../env/${args.env}.env`)
    : path.join(__dirname, `../env/${args.env}.env`);
dotenv.config({
  path: dotEnvPath,
});

const variables = {
  NodeEnv: process.env.NODE_ENV ?? '',
  Port: process.env.PORT ?? 0,
} as const;

export default variables;

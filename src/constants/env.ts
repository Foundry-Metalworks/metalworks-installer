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
  Port: Number(process.env.PORT) ?? 0,
  Name: process.env.DOMAIN_NAME ?? '',
  TestDropletId: Number(process.env.TEST_DROPLET_ID) ?? 0,
  MetalworksUrl: process.env.METALWORKS_URL ?? '',
  GroupToken: process.env.GROUP_TOKEN ?? '',
} as const;

export default variables;

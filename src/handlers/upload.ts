import { RequestHandler } from 'express';
import { RouteError } from '@/types/errors';
import { HttpStatusCodes } from '@/constants/http';
import { caddySettings, foundrySettings, hostName, isFoundryInstalled } from '@/constants/foundry';
import { homedir } from 'os';
import fs from 'fs';
import { emptyDirSync, writeJsonSync } from 'fs-extra';
import AdmZip from 'adm-zip';
import logger from 'jet-logger';
import shellExec from 'shell-exec';

const onUpload: RequestHandler = async (req, res) => {
  const file = req.files?.foundry ?? undefined;
  if (!file || 'length' in file) {
    throw new RouteError(HttpStatusCodes.BAD_REQUEST, 'Single file foundry is required');
  }
  if (isFoundryInstalled) {
    throw new RouteError(HttpStatusCodes.BAD_REQUEST, 'FoundryVTT is already installed');
  }

  // Extract Foundry
  const homeDir = homedir();
  if (!fs.existsSync(`${homeDir}/foundry`)) {
    fs.mkdirSync(`${homeDir}/foundry`);
  } else emptyDirSync(`${homeDir}/foundry`);
  if (!fs.existsSync(`${homeDir}/foundrydata`)) {
    fs.mkdirSync(`${homeDir}/foundrydata`);
  }
  new AdmZip(file.data).extractAllTo(`${homeDir}/foundry`);
  logger.info('Extracted FoundryVTT');

  // Settings
  writeJsonSync(`${homeDir}/foundrydata/Config/options.json`, foundrySettings);
  logger.info('Updated Foundry settings');

  // Caddy
  if (!fs.existsSync('/etc/caddy')) {
    fs.mkdirSync('/etc/caddy');
  }
  fs.writeFileSync('/etc/caddy/Caddyfile', caddySettings);
  await shellExec('systemctl reload caddy');
  logger.info('Configured Caddy reverse proxy');

  // Return
  logger.info('Successfully installed FoundryVTT');
  return res.status(HttpStatusCodes.SEE_OTHER).redirect(`https://${hostName}`);
};

export { onUpload };

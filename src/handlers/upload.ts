import { RequestHandler } from 'express';
import { RouteError } from '@/types/errors';
import { HttpStatusCodes } from '@/constants/http';
import { caddySettings, foundrySettings, isFoundryInstalled } from '@/constants/foundry';
import { homedir } from 'os';
import fs from 'fs';
import { createFileSync, emptyDirSync, writeJsonSync } from 'fs-extra';
import AdmZip from 'adm-zip';
import logger from 'jet-logger';
import shellExec from 'shell-exec';
import axios from 'axios';
import { startFoundry } from '@/services/foundry';
import env from '@/constants/env';

const onUpload: RequestHandler = async (req, res) => {
  const url = req.body.url as string;
  const { data, status } = await axios.get(url, {
    responseType: 'arraybuffer',
    timeout: 120000,
    onDownloadProgress: (progressEvent) => {
      logger.info('progress: ' + progressEvent.progress);
    },
  });

  if (!data || status !== HttpStatusCodes.OK.valueOf()) {
    throw new RouteError(HttpStatusCodes.BAD_REQUEST, 'Single zip file foundry is required');
  }
  try {
    new AdmZip(data);
  } catch (e) {
    throw new RouteError(HttpStatusCodes.BAD_REQUEST, 'Single zip file foundry is required');
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
  new AdmZip(data).extractAllTo(`${homeDir}/foundry`);
  logger.info('Extracted FoundryVTT');

  // Settings
  createFileSync(`${homeDir}/foundrydata/Config/options.json`);
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
  startFoundry();
  return res.send(`https://${env.Name}.dnd.tenzin.live`);
};

export { onUpload };

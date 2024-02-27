import express from 'express';
import { RouteError } from '@/types/errors';
import { HttpStatusCodes } from '@/constants/http';
import AdmZip from 'adm-zip';
import { homedir } from 'os';
import fileUpload from 'express-fileupload';
import fs from 'fs';
import { emptyDirSync, writeJsonSync } from 'fs-extra';
import shellExec from 'shell-exec';
import logger from 'jet-logger';
import { foundrySettings, caddySettings, hostName } from '@/constants/foundry';

const router = express.Router();
const upload = fileUpload();

router.post('/upload', upload, async (req, res) => {
  const file = req.files?.foundry ?? undefined;
  if (!file || 'length' in file) {
    throw new RouteError(HttpStatusCodes.BAD_REQUEST, 'Single file foundry is required');
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

  // Setup PM2
  await shellExec(
    `pm2 start "${homeDir}/foundry/resources/app/main.js" --name foundry -- --dataPath=${homeDir}/foundrydata`,
  );
  await shellExec('pm2 startup');
  logger.info('Configured FoundryVTT auto-start');

  // Caddy
  if (!fs.existsSync('/etc/caddy')) {
    fs.mkdirSync('/etc/caddy');
  }
  fs.writeFileSync('/etc/caddy/Caddyfile', caddySettings);
  await shellExec('systemctl restart caddy');
  logger.info('Configured Caddy reverse proxy');

  // Return
  logger.info('Successfully installed FoundryVTT');
  return res.redirect(`https://${hostName}`);
});

export default router;

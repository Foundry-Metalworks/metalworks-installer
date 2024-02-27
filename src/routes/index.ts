import express from 'express';
import { RouteError } from '@/types/errors';
import { HttpStatusCodes } from '@/constants/http';
import AdmZip from 'adm-zip';
import { homedir } from 'os';
import fileUpload from 'express-fileupload';
import fs from 'fs';
import { emptyDirSync } from 'fs-extra';
import shellExec from 'shell-exec';
import logger from 'jet-logger';

const router = express.Router();
const upload = fileUpload();

router.post('/upload', upload, async (req) => {
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

  // Install PM2
  await shellExec('npm i -g pm2');
  await shellExec(
    `pm2 start "${homeDir}/foundry/resources/app/main.js" --name foundry -- --dataPath=${homeDir}/foundrydata`,
  );
  await shellExec('pm2 startup');
  logger.info('successfully installed FoundryVTT');
});

export default router;

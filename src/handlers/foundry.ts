import { RequestHandler } from 'express';
import * as foundryService from '@/services/foundry';
import { FoundryStatus } from '@/types/foundry';

const startFoundry: RequestHandler = (_req, res) => {
  foundryService.startFoundry();
  return res.sendStatus(200);
};

const stopFoundry: RequestHandler = (_req, res) => {
  foundryService.stopFoundry();
  return res.sendStatus(200);
};

const getFoundryStatus: RequestHandler = (_req, res) => {
  let foundryStatus: FoundryStatus = FoundryStatus.uninstalled;
  if (foundryService.isFoundryInstalled()) {
    if (foundryService.isFoundryRunning()) {
      foundryStatus = FoundryStatus.on;
    } else foundryStatus = FoundryStatus.off;
  }
  return res.status(200).send({ status: foundryStatus });
};

export { startFoundry, stopFoundry, getFoundryStatus };

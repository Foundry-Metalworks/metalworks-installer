import { RequestHandler } from 'express';
import * as foundryService from '@/services/foundry';
import * as digitalOceanService from '@/services/digitalocean';
import { FoundryStatus } from '@/types/foundry';
import { HttpStatusCodes } from '@/constants/http';

const startFoundry: RequestHandler = (_req, res) => {
  foundryService.startFoundry();
  return res.sendStatus(HttpStatusCodes.OK);
};

const stopFoundry: RequestHandler = (_req, res) => {
  foundryService.stopFoundry();
  return res.sendStatus(HttpStatusCodes.OK);
};

const shutdownFoundry: RequestHandler = (_req, res) => {
  foundryService.stopFoundry();
  digitalOceanService.shutdownDroplet();
  return res.sendStatus(HttpStatusCodes.OK);
};

const saveFoundry: RequestHandler = async (_req, res) => {
  const action = await digitalOceanService.snapshotDroplet();
  await digitalOceanService.waitForActionComplete(action);
  res.status(HttpStatusCodes.OK).send({ snapshotId: action.resource_id });
};

const getFoundryStatus: RequestHandler = (_req, res) => {
  let foundryStatus: FoundryStatus = FoundryStatus.uninstalled;
  if (foundryService.isFoundryInstalled()) {
    if (foundryService.isFoundryRunning()) {
      if (digitalOceanService.isActionPending()) {
        foundryStatus = FoundryStatus.busy;
      } else foundryStatus = FoundryStatus.on;
    } else foundryStatus = FoundryStatus.off;
  }
  return res.status(HttpStatusCodes.OK).send(foundryStatus);
};

export { startFoundry, stopFoundry, shutdownFoundry, saveFoundry, getFoundryStatus };

import { RequestHandler } from 'express';
import * as digitalOceanService from '@/services/digitalocean';
import { HttpStatusCodes } from '@/constants/http';

const stopDroplet: RequestHandler = async (_req, res) => {
  await digitalOceanService.saveAndDestroyDroplet();
  res.sendStatus(HttpStatusCodes.OK);
};

const saveDroplet: RequestHandler = async (_req, res) => {
  const action = await digitalOceanService.snapshotDroplet();
  await digitalOceanService.waitForActionComplete(action);
  res.status(HttpStatusCodes.OK).send({ snapshotId: action.resource_id });
};

export { stopDroplet, saveDroplet };

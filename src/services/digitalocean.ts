import axios from 'axios';
import { createApiClient } from 'dots-wrapper';
import env from '@/constants/env';
import { IAction } from 'dots-wrapper/dist/action';
import { RouteError } from '@/types/errors';
import { HttpStatusCodes } from '@/constants/http';

const digitalOceanAPI = createApiClient({ token: env.DigitalOceanKey });
const metadataAPI = axios.create({
  baseURL: 'http://169.254.169.254/metadata/v1',
});

let droplet_id = env.TestDropletId;
if (env.NodeEnv === 'production') {
  dropletID().then((val) => (droplet_id = val));
}

async function dropletID(): Promise<number> {
  return Number(await metadataAPI.get('id'));
}

async function snapshotDroplet() {
  const snapshotResult = await digitalOceanAPI.droplet.snapshotDroplet({ droplet_id });
  return snapshotResult.data.action;
}

async function deleteOldestSnapshot() {
  const {
    data: { snapshots },
  } = await digitalOceanAPI.snapshot.listSnapshots({
    resource_type: 'droplet',
  });
  const oldest = snapshots
    .filter((s) => s.tags.includes('dnd'))
    .sort((a, b) => {
      const dateA = Date.parse(a.created_at);
      const dateB = Date.parse(b.created_at);
      return dateA - dateB;
    })
    .pop();
  await digitalOceanAPI.snapshot.deleteSnapshot({
    snapshot_id: oldest?.id as string,
  });
}

async function shutdownDroplet() {
  const shutdownResult = await digitalOceanAPI.droplet.shutdownDroplet({ droplet_id });
  return shutdownResult.data.action;
}

async function destroyDroplet() {
  const destroyResult = await digitalOceanAPI.droplet.deleteDroplet({ droplet_id });
  // eslint-disable-next-line
  return (destroyResult.data as any).action as IAction;
}

let _isActionPending = false;
async function waitForActionComplete(action: IAction) {
  _isActionPending = true;
  if (action.status === 'errored') {
    _isActionPending = false;
    throw new RouteError(
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
      'Failed to complete action: ' + action.type,
    );
  } else if (action.status === 'in-progress') {
    const statusResult = await digitalOceanAPI.action.getAction({ action_id: action.id });
    await new Promise((resolve) => {
      setTimeout(() => {
        waitForActionComplete(statusResult.data.action).then((data) => {
          _isActionPending = false;
          resolve(data);
        });
      }, 5000);
    });
  }
}

function isActionPending() {
  return _isActionPending;
}

async function saveAndDestroyDroplet() {
  const shutdownAction = await shutdownDroplet();
  await waitForActionComplete(shutdownAction);
  const snapshotAction = await snapshotDroplet();
  await waitForActionComplete(snapshotAction);
  await destroyDroplet();
  await deleteOldestSnapshot();
}

export {
  snapshotDroplet,
  shutdownDroplet,
  destroyDroplet,
  saveAndDestroyDroplet,
  waitForActionComplete,
  deleteOldestSnapshot,
  isActionPending,
};

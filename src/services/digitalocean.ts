import axios from 'axios';
import { createApiClient } from 'dots-wrapper';
import env from '@/constants/env';
import { IAction } from 'dots-wrapper/dist/action';

const digitalOceanAPI = createApiClient({ token: env.DigitalOceanKey });
const metadataAPI = axios.create({
  baseURL: 'http://169.254.169.254/metadata/v1',
});

let droplet_id = -1;
dropletID().then((val) => (droplet_id = val));

async function dropletID(): Promise<number> {
  return Number(await metadataAPI.get('id'));
}

async function snapshotDroplet() {
  const snapshotResult = await digitalOceanAPI.droplet.snapshotDroplet({ droplet_id });
  return snapshotResult.data.action;
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

async function waitForActionComplete(action: IAction) {
  if (action.status === 'errored') {
    const retryResult = await digitalOceanAPI.droplet.snapshotDroplet({ droplet_id });
    await new Promise((resolve) => {
      setTimeout(() => {
        waitForActionComplete(retryResult.data.action).then(resolve);
      }, 5000);
    });
  } else if (action.status === 'in-progress') {
    const statusResult = await digitalOceanAPI.action.getAction({ action_id: action.id });
    await new Promise((resolve) => {
      setTimeout(() => {
        waitForActionComplete(statusResult.data.action).then(resolve);
      }, 5000);
    });
  }
}

async function saveAndDestroyDroplet() {
  const shutdownAction = await shutdownDroplet();
  await waitForActionComplete(shutdownAction);
  const snapshotAction = await snapshotDroplet();
  await waitForActionComplete(snapshotAction);
  await destroyDroplet();
}

export {
  snapshotDroplet,
  shutdownDroplet,
  destroyDroplet,
  saveAndDestroyDroplet,
  waitForActionComplete,
};

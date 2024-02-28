import logger from 'jet-logger';
import EnvVars from '@/constants/env';
import server from './server';
import {
  isFoundryIdle,
  isFoundryInstalled,
  isFoundryRunning,
  startFoundry,
  stopFoundry,
} from '@/services/foundry';
import { saveAndDestroyDroplet } from '@/services/digitalocean';

// Start FoundryVTT
let idleCount = 0;
if (isFoundryInstalled()) {
  startFoundry();
  logger.info('Foundry server started on port 30000');
  setInterval(async () => {
    if (isFoundryRunning()) {
      if (await isFoundryIdle()) {
        ++idleCount;
      }
      if (idleCount >= 60) {
        stopFoundry();
        await saveAndDestroyDroplet();
      }
    }
  }, 60000);
}

// Start ExpressJS
const SERVER_START_MSG = 'Express server started on port: ' + EnvVars.Port.toString();
server.listen(EnvVars.Port, () => {
  logger.info(SERVER_START_MSG);
});

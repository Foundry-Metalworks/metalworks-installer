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
import shellExec from 'shell-exec';

// Start FoundryVTT
let idleCount = 0;
if (isFoundryInstalled()) {
  startFoundry();
  logger.info('Foundry server started on port 30000');
  setInterval(async () => {
    if (isFoundryRunning()) {
      logger.info('Checking if FoundryVTT is idle..');
      if (await isFoundryIdle()) {
        logger.info(`FoundryVTT is idle. ${60 - idleCount} more idle checks until shutdown`);
        ++idleCount;
      } else {
        logger.info('FoundryVTT is not idle. Resetting idle time');
        idleCount = 0;
      }
      if (idleCount >= 1) {
        logger.info('FoundryVTT idle too long. Shutting down...');
        stopFoundry();
        await saveAndDestroyDroplet();
      }
    }
  }, 6000);
}

// Start ExpressJS
const SERVER_START_MSG = 'Express server started on port: ' + EnvVars.Port.toString();
shellExec(`ufw allow ${EnvVars.Port}/tcp`).then(() => logger.info('Opened Port'));
server.listen(EnvVars.Port, () => {
  logger.info(SERVER_START_MSG);
});

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
import shellExec from 'shell-exec';
import { autoShutdown } from '@/services/metalworks';

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
      if (idleCount >= 60) {
        logger.info('FoundryVTT idle too long. Shutting down...');
        stopFoundry();
        autoShutdown();
      }
    }
  }, 60000);
}

// Start ExpressJS
const SERVER_START_MSG = 'Express server started on port: ' + EnvVars.Port.toString();
shellExec(`ufw allow ${EnvVars.Port}/tcp`).then(() => logger.info('Opened Port'));
server.listen(EnvVars.Port, () => {
  logger.info(SERVER_START_MSG);
});

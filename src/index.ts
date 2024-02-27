import 'module-alias/register';
import logger from 'jet-logger';
import EnvVars from '@/constants/env';
import server from './server';

// Start server
const SERVER_START_MSG = 'Express server started on port: ' + EnvVars.Port.toString();
server.listen(EnvVars.Port, () => {
  logger.info(SERVER_START_MSG);
});

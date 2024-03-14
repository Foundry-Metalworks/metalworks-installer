import fs from 'fs';
import { homeDir } from '@/constants/foundry';
import { fork, ChildProcess } from 'child_process';
import logger from 'jet-logger';
import shellExec from 'shell-exec';

let foundryInstance: ChildProcess | null = null;
let foundryStatus: 'on' | 'off' = 'off';

function isFoundryInstalled() {
  return fs.existsSync(`${homeDir}/foundry/resources/app/main.js`);
}

function forkFoundry(): ChildProcess {
  return fork(`${homeDir}/foundry/resources/app/main.js`, [`--dataPath=${homeDir}/foundrydata`]);
}

async function isFoundryIdle(): Promise<boolean> {
  const result = await shellExec('netstat -ant | grep 30000 | grep ESTABLISHED | wc -l');
  return !Number(result.stdout);
}

function startFoundry() {
  if (!foundryInstance || foundryStatus != 'on') {
    foundryInstance = forkFoundry();
    foundryStatus = 'on';
    foundryInstance.on('error', forkFoundry);
    foundryInstance.on('close', () => {
      foundryStatus = 'off';
      logger.info('FoundryVTT server closed');
    });
    foundryInstance.on('exit', () => {
      foundryStatus = 'off';
      logger.info('FoundryVTT server exited');
    });
  }
}

function stopFoundry() {
  foundryInstance?.kill();
  foundryStatus = 'off';
}

function isFoundryRunning() {
  return foundryStatus === 'on';
}

export { isFoundryInstalled, isFoundryRunning, isFoundryIdle, startFoundry, stopFoundry };

import { homedir } from 'os';
import env from '@/constants/env';
import fs from 'fs';

const homeDir = homedir();
const hostName = `${env.Name}.dnd.tenzin.live`;
const isFoundryInstalled = fs.existsSync(`${homeDir}/foundry/resources/app/main.js`);
const caddySettings = `
api.${hostName} {
  @http {
    protocol http
  }
  redir @http https://${hostName}
  reverse_proxy localhost:8081
}
${hostName} {
  @http {
    protocol http
  }
  redir @http https://${hostName}
  reverse_proxy localhost:30000
}
`;
const foundrySettings = {
  dataPath: `${homeDir}/foundry`,
  compressStatic: true,
  fullscreen: false,
  hostname: hostName,
  language: 'en.core',
  localHostname: null,
  port: 30000,
  protocol: null,
  proxyPort: null,
  proxySSL: true,
  routePrefix: null,
  updateChannel: 'stable',
  upnp: true,
  upnpLeaseDuration: null,
  awsConfig: null,
  passwordSalt: null,
  sslCert: null,
  sslKey: null,
  world: null,
  serviceConfig: null,
};

export { homeDir, isFoundryInstalled, hostName, caddySettings, foundrySettings };

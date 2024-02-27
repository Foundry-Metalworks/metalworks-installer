import { homedir } from 'os';
import env from '@/constants/env';

const homeDir = homedir();

const hostName = `${env.Name}.dnd.tenzin.live`;

const caddySettings = `
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
  proxySSL: false,
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

export { hostName, caddySettings, foundrySettings };

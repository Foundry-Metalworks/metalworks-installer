import axios from 'axios';
import env from '@/constants/env';

const client = axios.create({
  baseURL: `${env.MetalworksUrl}/public/api/v1`,
});

client.interceptors.request.use((config) => {
  config.data.token = env.GroupToken;
  config.data.slug = env.Name;
  return config;
});

async function autoShutdown() {
  await client.post('/autoshutdown');
}

export { autoShutdown };

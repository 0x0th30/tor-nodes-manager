import { createClient } from 'redis';
import { logger } from '@loaders/logger';

const TIMEOUT_IN_MS = 5000;

const url = process.env['REDIS_URI'];
const client = createClient({
  url,
  socket: { reconnectStrategy: TIMEOUT_IN_MS },
});
client.connect();

client.on('ready', () => {
  logger.info('Redis connection has been successfully established!');
});

client.on('error', () => {
  logger.error(`Redis connection has been failed. Trying again in ${TIMEOUT_IN_MS}ms...`);
});

export { client };

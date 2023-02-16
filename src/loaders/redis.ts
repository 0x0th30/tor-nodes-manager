import { createClient } from 'redis';
import { logger } from '@loaders/logger';

const TIMEOUT_IN_MS = 5000;

const url = process.env['REDIS_URI'];
const redisClient = createClient({
  url,
  socket: { reconnectStrategy: TIMEOUT_IN_MS },
});
redisClient.connect();

redisClient.on('ready', () => {
  logger.info('Redis connection has been successfully established!');
});

redisClient.on('error', () => {
  logger.error(`Redis connection has been failed. Trying again in ${TIMEOUT_IN_MS}ms...`);
});

export { redisClient };

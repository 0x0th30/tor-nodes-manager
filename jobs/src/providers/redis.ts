import { createClient } from 'redis';

const TIMEOUT_IN_MS = 5000;

const url = process.env['REDIS_URI'];
const redisClient = createClient({
  url,
  socket: { reconnectStrategy: TIMEOUT_IN_MS },
});
redisClient.connect();

redisClient.on('ready', () => {
  console.log('Redis connection was successfully established!');
});

redisClient.on('error', (error) => {
  console.log(`Redis connection has been failed: ${error}.`
    + ` Trying again in ${TIMEOUT_IN_MS}ms...`);
});

export { redisClient };

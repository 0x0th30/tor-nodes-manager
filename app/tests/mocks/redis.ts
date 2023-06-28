import { redisClient } from '@loaders/redis';

export const RedisClientMock = {
  lRange: jest.spyOn(redisClient, 'lRange'),
  ttl: jest.spyOn(redisClient, 'ttl'),
};

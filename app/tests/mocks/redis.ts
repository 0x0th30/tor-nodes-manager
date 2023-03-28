import { redisClient } from '@loaders/redis';

export const RedisClientMock = {
  lRange: jest.spyOn(redisClient, 'lRange'),
  rPush: jest.spyOn(redisClient, 'rPush'),
  expire: jest.spyOn(redisClient, 'expire'),
};

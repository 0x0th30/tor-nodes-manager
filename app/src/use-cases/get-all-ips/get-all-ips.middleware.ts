import { Request, Response } from 'express';
import { RedisClientType } from '@redis/client';
import { Middleware } from '@contracts/middleware';
import { GetAllIps } from '@use-cases/get-all-ips/get-all-ips.business';
import { redisClient } from '@loaders/redis';
import { RabbitMQ } from '@loaders/rabbitmq';
import { GetAllIpsHTTPResponse } from './get-all-ips.d';

const RabbitMQClient = new RabbitMQ();
const GetAllIpsBusiness = new GetAllIps(
  redisClient as RedisClientType,
  RabbitMQClient,
);

class GetAllIpsMiddleware implements Middleware {
  public async handle(_request: Request, response: Response) {
    const responseContent: GetAllIpsHTTPResponse = { success: false };

    const getAllIpsResponse = await GetAllIpsBusiness.execute();

    if (getAllIpsResponse.success && getAllIpsResponse.data) {
      responseContent.success = true;
      responseContent.data = {
        results: getAllIpsResponse.data.results,
        addresses: getAllIpsResponse.data.addresses,
      };
      return response.status(200).json(responseContent);
    }

    responseContent.success = false;
    responseContent.message = 'Internal/unknown error occurred, report this issue!';
    return response.status(500).json(responseContent);
  }
}

export { GetAllIpsMiddleware };

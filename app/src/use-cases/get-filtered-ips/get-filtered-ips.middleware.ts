import { Request, Response } from 'express';
import { RedisClientType } from '@redis/client';
import { Middleware } from '@contracts/middleware';
import { GetAllIps } from '@use-cases/get-all-ips/get-all-ips.business';
import { GetBannedIps } from '@use-cases/get-banned-ips/get-banned-ips.business';
import { GetFilteredIps } from '@use-cases/get-filtered-ips/get-filtered-ips.business';
import { redisClient } from '@loaders/redis';
import { RabbitMQ } from '@loaders/rabbitmq';
import { GetFilteredIpsHTTPResponse } from './get-filtered-ips.d';

const RabbitMQClient = new RabbitMQ();
const GetAllIpsBusiness = new GetAllIps(
  redisClient as RedisClientType,
  RabbitMQClient,
);
const GetBannedIpsBusiness = new GetBannedIps();
const GetFilteredIpsBusiness = new GetFilteredIps(
  GetAllIpsBusiness,
  GetBannedIpsBusiness,
);

class GetFilteredIpsMiddleware implements Middleware {
  public async handle(_request: Request, response: Response) {
    const responseContent: GetFilteredIpsHTTPResponse = { success: false };

    const getFilteredIpsResponse = await GetFilteredIpsBusiness.execute();

    if (getFilteredIpsResponse.success && getFilteredIpsResponse.data) {
      responseContent.success = true;
      responseContent.data = {
        results: getFilteredIpsResponse.data.results,
        bannedIps: getFilteredIpsResponse.data.bannedIps,
        addresses: getFilteredIpsResponse.data.addresses,
      };
      return response.status(200).json(responseContent);
    }

    responseContent.success = false;
    responseContent.message = 'Internal/unknown error occurred, report this issue!';
    return response.status(500).json(responseContent);
  }
}

export { GetFilteredIpsMiddleware };

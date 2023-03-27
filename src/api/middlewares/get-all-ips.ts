import { Request, Response } from 'express';
import { Middleware, APIResponse } from '@contracts/middleware';
import { GetAllIps, GetAllIpsResponse } from '@use-cases/get-all-ips';
import { OnionooAPI } from '@providers/onionoo';
import { DanMeAPI } from '@providers/dan-me-uk';
import { redisClient } from '@loaders/redis';
import { logger } from '@loaders/logger';
import { RedisClientType } from '@redis/client';

class GetAllIpsMiddleware implements Middleware {
  public async action(request: Request, response: Response) {
    logger.info(`Received request on "${request.path}" from "${request.ip}"...`);
    const responseContent: APIResponse = { success: false };

    const onionooClient = new OnionooAPI();
    const danMeClient = new DanMeAPI();
    const getAllIps = new GetAllIps(
      onionooClient,
      danMeClient,
      redisClient as RedisClientType,
    );

    const getAllIpsResponse: GetAllIpsResponse = await getAllIps.execute();

    if (!getAllIpsResponse.success) {
      responseContent.success = false;
      responseContent.message = getAllIpsResponse.message;

      logger.error('Internal Server Error. Returning status code 500!');
      return response.status(500).json(responseContent);
    }

    responseContent.success = true;
    responseContent.data = getAllIpsResponse.data;
    if (getAllIpsResponse.message) responseContent.message = getAllIpsResponse.message;

    logger.info('Request was successfully responded. Returning status code 200!');
    return response.status(200).json(responseContent);
  }
}

export { GetAllIpsMiddleware };

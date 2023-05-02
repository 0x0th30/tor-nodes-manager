import { Request, Response } from 'express';
import { RedisClientType } from '@redis/client';
import { Middleware } from '@contracts/middleware';
import { GetAllIps } from '@use-cases/get-all-ips/get-all-ips.business';
import { redisClient } from '@loaders/redis';
import { RabbitMQ } from '@loaders/rabbitmq';
import { logger } from '@utils/logger';
import { GetAllIpsHTTPResponse } from './get-all-ips.d';

class GetAllIpsMiddleware implements Middleware {
  public async handle(request: Request, response: Response) {
    logger.info(`Received request on "${request.path}" from "${request.ip}"...`);
    const responseContent: GetAllIpsHTTPResponse = { success: false };

    const rabbitmqClient = new RabbitMQ();

    const getAllIps = new GetAllIps(
      redisClient as RedisClientType,
      rabbitmqClient,
    );

    const getAllIpsResponse = await getAllIps.execute();

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

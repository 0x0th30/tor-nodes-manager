import { Request, Response } from 'express';
import { Middleware, APIResponse } from '@contracts/middleware';
import { GetAllIps } from '@use-cases/get-all-ips';
import { GetBannedIps } from '@use-cases/get-banned-ips';
import { GetFilteredIps, GetFilteredIpsResponse } from '@use-cases/get-filtered-ips';
import { OnionooAPI } from '@providers/onionoo';
import { DanMeAPI } from '@providers/dan-me-uk';
import { redisClient } from '@loaders/redis';
import { logger } from '@loaders/logger';

class GetFilteredIpsMiddleware implements Middleware {
  public async action(request: Request, response: Response) {
    logger.info(`Received request on "${request.path}" from "${request.ip}"...`);
    const responseContent: APIResponse = { success: false };

    const onionooClient = new OnionooAPI();
    const danMeClient = new DanMeAPI();
    const getAllIps = new GetAllIps(onionooClient, danMeClient, redisClient as any);
    const getBannedIps = new GetBannedIps();

    const getFilteredIps = new GetFilteredIps(getAllIps, getBannedIps);
    const getFilteredIpsResponse: GetFilteredIpsResponse = await getFilteredIps.execute();

    if (!getFilteredIpsResponse.success || !getFilteredIpsResponse.data) {
      responseContent.success = false;
      responseContent.message = getFilteredIpsResponse.message;

      logger.error('Internal Server Error. Returning status code 500!');
      return response.status(500).json(responseContent);
    }

    responseContent.success = true;
    responseContent.data = {
      results: getFilteredIpsResponse.data.results,
      bannedIps: getFilteredIpsResponse.data.bannedIps,
      addresses: getFilteredIpsResponse.data.addresses,
    };

    logger.info('Request was successfully responded. Returning status code 200!');
    return response.status(200).json(responseContent);
  }
}

export { GetFilteredIpsMiddleware };

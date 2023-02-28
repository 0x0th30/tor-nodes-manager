import { Request, Response } from 'express';
import { Middleware, APIResponse } from '@contracts/middleware';
import { GetAllIps } from '@use-cases/get-all-ips';
import { GetBannedIps } from '@use-cases/get-banned-ips';
import { GetFilteredIps, GetFilteredIpsResponse } from '@use-cases/get-filtered-ips';
import { OnionooAPI } from '@3rd-party/onionoo';
import { DanMeAPI } from '@3rd-party/dan-me-uk';
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

      return response.status(500).json(responseContent);
    }

    responseContent.success = true;
    responseContent.data = {
      results: getFilteredIpsResponse.data.results,
      bannedIps: getFilteredIpsResponse.data.bannedIps,
      addresses: getFilteredIpsResponse.data.addresses,
    };

    return response.status(200).json(responseContent);
  }
}

export { GetFilteredIpsMiddleware };

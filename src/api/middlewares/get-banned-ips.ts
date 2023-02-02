import { Request, Response } from 'express';
import { Middleware, APIResponse } from '@contracts/middleware';
import { GetBannedIps, GetBannedIpsResponse } from '@use-cases/get-banned-ips';
import { logger } from '@loaders/logger';

class GetBannedIpsMiddleware implements Middleware {
  public async action(request: Request, response: Response) {
    logger.info(`Received request on "${request.path}" from "${request.ip}"...`);
    const responseContent: APIResponse = { success: false };

    const getBannedIps = new GetBannedIps();
    const getBannedIpsResponse: GetBannedIpsResponse = await getBannedIps.execute();

    if (!getBannedIpsResponse.success) {
      responseContent.success = false;
      responseContent.message = getBannedIpsResponse.message;

      logger.error('Internal Server Error. Returning status code 500!');
      return response.status(500).json(responseContent);
    }

    responseContent.success = true;
    responseContent.data = { bannedIps: getBannedIpsResponse.data?.addresses };

    logger.info('Request was successfully responded!');
    return response.status(200).json(responseContent);
  }
}

export { GetBannedIpsMiddleware };

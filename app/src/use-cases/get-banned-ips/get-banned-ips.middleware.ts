import { Request, Response } from 'express';
import { Middleware } from '@contracts/middleware';
import { GetBannedIps } from '@use-cases/get-banned-ips/get-banned-ips.business';
import { logger } from '@utils/logger';

class GetBannedIpsMiddleware implements Middleware {
  public async handle(request: Request, response: Response) {
    logger.info(`Received request on "${request.path}" from "${request.ip}"...`);
    const responseContent: GetBannedIpsHTTPResponse = { success: false };

    const getBannedIps = new GetBannedIps();
    const getBannedIpsResponse = await getBannedIps.execute();

    if (!getBannedIpsResponse.success) {
      responseContent.success = false;
      responseContent.message = getBannedIpsResponse.message;

      logger.error('Internal Server Error. Returning status code 500!');
      return response.status(500).json(responseContent);
    }

    responseContent.success = true;
    // eslint-disable-next-line max-len
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-non-null-asserted-optional-chain
    responseContent.data = { bannedIps: getBannedIpsResponse.data?.addresses! };

    logger.info('Request was successfully responded. Returning status code 200!');
    return response.status(200).json(responseContent);
  }
}

export { GetBannedIpsMiddleware };

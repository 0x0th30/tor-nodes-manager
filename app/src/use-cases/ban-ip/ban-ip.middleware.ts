import { Request, Response } from 'express';
import { Middleware } from '@contracts/middleware';
import { BanIp } from '@use-cases/ban-ip/ban-ip.business';
import { logger } from '@utils/logger';
import { BanIpHTTPResponse } from './ban-ip.d';

export class BanIpMiddleware implements Middleware {
  public async handle(request: Request, response: Response) {
    logger.info(`Received request on "${request.path}" from "${request.ip}"...`);
    const responseContent: BanIpHTTPResponse = { success: false };

    logger.info('Checking request body...');
    if (!request.body.address) {
      responseContent.success = false;
      responseContent.message = 'Missing "address" field in request body!';

      logger.error('Bad Request. Returning status code 400!');
      return response.status(400).json(responseContent);
    }

    const { address } = request.body;

    const banIp = new BanIp();
    const banIpResponse = await banIp.execute(address);

    if (!banIpResponse.success) {
      responseContent.success = false;
      responseContent.message = banIpResponse.message;

      logger.error('Internal Server Error. Returning status code 500!');
      return response.status(500).json(responseContent);
    }

    responseContent.success = true;
    responseContent.data = { bannedIp: address };

    logger.info('Request was successfully responded. Returning status code 201!');
    return response.status(201).json(responseContent);
  }
}

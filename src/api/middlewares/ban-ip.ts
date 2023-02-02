import { Request, Response } from 'express';
import { Middleware, APIResponse } from '@contracts/middleware';
import { BanIp, BanIpRequest, BanIpResponse } from '@use-cases/ban-ip';
import { logger } from '@loaders/logger';

class BanIpMiddleware implements Middleware {
  public async action(request: Request, response: Response) {
    logger.info(`Received request on "${request.path}" from "${request.ip}"...`);
    const responseContent: APIResponse = { success: false };

    logger.info('Checking request body...');
    if (!request.body.address) {
      responseContent.success = false;
      responseContent.message = 'Missing "address" field in request body!';

      logger.error('Bad Request. Returning status code 400!');
      return response.status(400).json(responseContent);
    }

    const { address } = request.body;

    const banIp = new BanIp();
    const banIpRequest: BanIpRequest = { address };
    const banIpResponse: BanIpResponse = await banIp.execute(banIpRequest);

    if (!banIpResponse.success) {
      responseContent.success = false;
      responseContent.message = banIpResponse.message;

      logger.error('Internal Server Error. Returning status code 500!');
      return response.status(500).json(responseContent);
    }

    responseContent.success = true;
    responseContent.data = { bannedIp: address };

    logger.info('Request was successfully responded!');
    return response.status(201).json(responseContent);
  }
}

export { BanIpMiddleware };

import { Request, Response } from 'express';
import { Middleware } from '@contracts/middleware';
import { UnbanIp } from '@use-cases/unban-ip/unban-ip.business';
import { logger } from '@utils/logger';
import { UnbanIpHTTPResponse } from './unban-ip.d';

class UnbanIpMiddleware implements Middleware {
  public async handle(request: Request, response: Response) {
    logger.info(`Received request on "${request.path}" from "${request.ip}"...`);
    const responseContent: UnbanIpHTTPResponse = { success: false };

    logger.info('Checking request body...');
    if (!request.body.address) {
      responseContent.success = false;
      responseContent.message = 'Missing "address" field in request body!';

      logger.error('Bad Request. Returning status code 400!');
      return response.status(400).json(responseContent);
    }

    const { address } = request.body;

    const unbanIp = new UnbanIp();
    const unbanIpResponse = await unbanIp.execute(address);

    if (!unbanIpResponse.success) {
      responseContent.success = false;
      responseContent.message = unbanIpResponse.message;

      logger.error('Internal Server Error. Returning status code 500!');
      return response.status(500).json(responseContent);
    }

    responseContent.success = true;
    responseContent.data = { bannedIp: address };

    logger.info('Request was successfully responded. Returning status code 200!');
    return response.status(200).json(responseContent);
  }
}

export { UnbanIpMiddleware };

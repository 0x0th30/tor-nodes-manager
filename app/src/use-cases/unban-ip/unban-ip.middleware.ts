import { Request, Response } from 'express';
import { Middleware } from '@contracts/middleware';
import { UnbanIp } from '@use-cases/unban-ip/unban-ip.business';
import { UnbanIpHTTPResponse } from './unban-ip.d';

const UnbanIpBusiness = new UnbanIp();

class UnbanIpMiddleware implements Middleware {
  public async handle(request: Request, response: Response) {
    const responseContent: UnbanIpHTTPResponse = { success: false };

    const { address } = request.body;
    if (!address) {
      responseContent.success = false;
      responseContent.message = 'Missing "address" field in request body!';
      return response.status(400).json(responseContent);
    }

    const unbanIpResponse = await UnbanIpBusiness.execute(address);

    if (unbanIpResponse.success && unbanIpResponse.data) {
      responseContent.success = true;
      responseContent.data = { bannedIp: unbanIpResponse.data.address };
      return response.status(200).json(responseContent);
    }

    responseContent.success = false;
    responseContent.message = 'Internal/unknown error occurred, report this issue!';
    return response.status(500).json(responseContent);
  }
}

export { UnbanIpMiddleware };

import { Request, Response } from 'express';
import { Middleware } from '@contracts/middleware';
import { BanIp } from '@use-cases/ban-ip/ban-ip.business';
import { BanIpHTTPResponse } from './ban-ip.d';

export class BanIpMiddleware implements Middleware {
  public async handle(request: Request, response: Response) {
    const responseContent: BanIpHTTPResponse = { success: false };

    const { address } = request.body;
    if (address) {
      responseContent.success = false;
      responseContent.message = 'Missing "address" field in request body!';
      return response.status(400).json(responseContent);
    }

    const banIp = new BanIp();
    const banIpResponse = await banIp.execute(address);

    if (!banIpResponse.success) {
      responseContent.success = false;
      responseContent.message = banIpResponse.message;
      return response.status(500).json(responseContent);
    }

    responseContent.success = true;
    responseContent.data = { bannedIp: address };

    return response.status(201).json(responseContent);
  }
}

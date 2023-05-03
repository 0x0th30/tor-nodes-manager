import { Request, Response } from 'express';
import { Middleware } from '@contracts/middleware';
import { BanIp } from '@use-cases/ban-ip/ban-ip.business';
import { BanIpHTTPResponse } from './ban-ip.d';

const BanIpBusiness = new BanIp();

export class BanIpMiddleware implements Middleware {
  public async handle(request: Request, response: Response) {
    const responseContent: BanIpHTTPResponse = { success: false };

    const { address } = request.body;
    if (address) {
      responseContent.success = false;
      responseContent.message = 'Missing "address" field in request body!';
      return response.status(400).json(responseContent);
    }

    const banIpResponse = await BanIpBusiness.execute(address);

    if (banIpResponse.success && banIpResponse.data) {
      responseContent.success = true;
      responseContent.data = { bannedIp: banIpResponse.data.address };
      return response.status(201).json(responseContent);
    }

    if (banIpResponse.error?.message.search('E11000') !== -1) {
      responseContent.success = false;
      responseContent.message = `IP "${address}" already exists in base!`;
      return response.status(403).json(responseContent);
    }

    responseContent.success = false;
    responseContent.message = 'Internal/unknown error occurred, report this issue!';
    return response.status(500).json(responseContent);
  }
}

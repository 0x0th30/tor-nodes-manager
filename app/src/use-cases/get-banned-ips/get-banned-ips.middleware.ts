import { Request, Response } from 'express';
import { Middleware } from '@contracts/middleware';
import { GetBannedIps } from '@use-cases/get-banned-ips/get-banned-ips.business';
import { GetBannedIpsHTTPResponse } from './get-banned-ips.d';

const GetBannedIpsBusiness = new GetBannedIps();

class GetBannedIpsMiddleware implements Middleware {
  public async handle(_request: Request, response: Response) {
    const responseContent: GetBannedIpsHTTPResponse = { success: false };

    const getBannedIpsResponse = await GetBannedIpsBusiness.execute();

    if (getBannedIpsResponse.success && getBannedIpsResponse.data) {
      responseContent.success = true;
      responseContent.data = { bannedIps: getBannedIpsResponse.data.addresses };
      return response.status(200).json(responseContent);
    }

    responseContent.success = false;
    responseContent.message = 'Internal/unknown error occurred, report this issue!';
    return response.status(500).json(responseContent);
  }
}

export { GetBannedIpsMiddleware };

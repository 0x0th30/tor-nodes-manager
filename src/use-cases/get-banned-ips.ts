import { BannedIp } from '@data-access/database-manager';
import { logger } from '@loaders/logger';

interface GetBannedIpsResponse {
  success: boolean,
  message?: string,
  data?: { addresses: string[] },
}

class GetBannedIps {
  public async execute(): Promise<GetBannedIpsResponse> {
    logger.info('Initializing "get-banned-ips" use-case/service...');

    const response: GetBannedIpsResponse = { success: false };

    logger.info('Searching by IPs in primary base...');

    try {
      const bannedIps = await BannedIp.find({});
      const addresses: string[] = [];
      bannedIps.forEach((ip) => addresses.push(ip.address));
      logger.info('Banned IPs was successfully found.');

      response.success = true;
      response.data = { addresses };
    } catch (error: any) {
      logger.error(`Banned IPs searching was failed by ${error}!`);

      response.success = false;
      response.message = error.message;
    }

    logger.info('Finishing "get-banned-ips" use-cases/services.');
    return response;
  }
}

export { GetBannedIps, GetBannedIpsResponse };

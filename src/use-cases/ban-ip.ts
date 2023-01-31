import { BannedIp } from '@data-access/database-manager';
import { logger } from '@loaders/logger';

interface BanIpRequest {
  address: string,
}

interface BanIpResponse {
  success: boolean,
  message?: string,
  data?: { address: string },
}

class BanIp {
  public async execute(request: BanIpRequest): Promise<BanIpResponse> {
    logger.info('Initializing "ban-ip" use-case/service...');

    const response: BanIpResponse = { success: false };

    logger.info(`Inserting ip ${request.address} in primary base...`);
    await BannedIp.create({ address: request.address })
      .catch((error: Error) => {
        logger.error(`Ip insertion failed by ${error}!`);

        response.success = false;
        response.message = error.message;
      })
      .then(() => {
        response.success = true;
        response.data = { address: request.address };
      });

    return response;
  }
}

export { BanIp, BanIpRequest, BanIpResponse };

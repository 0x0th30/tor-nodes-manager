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

    logger.info(`Inserting IP ${request.address} in primary base...`);

    try {
      await BannedIp.create({ address: request.address });
      logger.info('The IP was successfully included.');

      response.success = true;
      response.data = { address: request.address };
    } catch (error: any) {
      logger.error(`IP insertion failed by ${error}!`);

      response.success = false;
      response.message = error.message;
    }

    logger.info('Finishing "ban-ip" use-case/service.');
    return response;
  }
}

export { BanIp, BanIpRequest, BanIpResponse };

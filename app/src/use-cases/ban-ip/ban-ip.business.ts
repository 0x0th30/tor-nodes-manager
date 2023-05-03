import { BannedIp } from '@models/banned-ip';
import { logger } from '@utils/logger';
import { BanIpDTO } from './ban-ip.d';

export class BanIp {
  public async execute(address: string): Promise<BanIpDTO> {
    logger.info('Initializing "ban-ip" use-case/service...');

    const response: BanIpDTO = { success: false };

    logger.info(`Inserting IP ${address} in primary base...`);
    await BannedIp.create({ address })
      .then((insertion) => {
        logger.info('The IP was successfully included.');
        response.success = true;
        response.data = { address: insertion.address };
      })
      .catch((error) => {
        logger.error(`IP insertion was failed. Details: ${error}`);
        response.success = false;
        response.error = error;
      });

    logger.info('Finishing "ban-ip" use-case/service.');
    return response;
  }
}

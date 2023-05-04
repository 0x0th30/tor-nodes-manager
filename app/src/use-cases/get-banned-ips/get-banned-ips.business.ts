import { BannedIp } from '@models/banned-ip';
import { logger } from '@utils/logger';
import { GetBannedIpsDTO } from './get-banned-ips.d';

export class GetBannedIps {
  public async execute(): Promise<GetBannedIpsDTO> {
    logger.info('Initializing "get-banned-ips" use-case/service...');

    const response: GetBannedIpsDTO = { success: false };

    logger.info('Searching by IPs in primary base...');
    await BannedIp.find({})
      .then((values) => {
        logger.info('Banned IPs was successfully found in primary base.');
        const addresses: string[] = [];
        values.forEach((result) => addresses.push(result.address));

        response.success = true;
        response.data = { addresses };
      })
      .catch((error) => {
        logger.error(`Cannot found banned IPs. Details ${error}`);
        response.success = false;
        response.error = error;
      });

    logger.info('Finishing "get-banned-ips" use-cases/services.');
    return response;
  }
}

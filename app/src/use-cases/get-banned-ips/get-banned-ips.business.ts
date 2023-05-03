import { Error } from 'mongoose';
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

  private generateSecureErrorMessage(error: Error): string {
    if (error instanceof Error.MongooseServerSelectionError) {
      logger.error(`Cannot connect with the specified URI. Details: ${error}`);
      return 'Database connection error, please report this issue!';
    }
    if (error instanceof Error.DocumentNotFoundError) {
      logger.error(`The specified document does not exists. Details: ${error}`);
      return 'Database internal error, please report this issue!';
    }
    if (error instanceof Error.MissingSchemaError) {
      logger.error(`The specified model isn't registered. Details: ${error}`);
      return 'Database internal error, please report this issue!';
    }

    logger.error(`Failed by unknown error. Details: ${error}`);
    return 'An internal/unknown error was throwed, please report this issue!';
  }
}

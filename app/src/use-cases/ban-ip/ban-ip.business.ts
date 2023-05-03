import { Error } from 'mongoose';
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
    // duplicate key error code
    if (error.message.search('E11000') !== -1) {
      logger.error('User was trying to insert an already existent IP');
      return 'This IP it\'s already registered.';
    }

    logger.error(`Failed by unknown error. Details: ${error}`);
    return 'An internal/unknown error was throwed, please report this issue!';
  }
}

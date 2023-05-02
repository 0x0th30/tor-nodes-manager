import { Error } from 'mongoose';
import { BannedIp } from '@models/banned-ip';
import { logger } from '@utils/logger';
import { UnbanIpDTO } from './unban-ip.d';

export class UnbanIp {
  public async execute(address: string): Promise<UnbanIpDTO> {
    logger.info('Initializing "unban-ip" use-case/service...');

    const response: UnbanIpDTO = { success: false };

    logger.info(`Removing IP ${address} from primary base...`);

    try {
      await BannedIp.deleteMany({ address });
      response.success = true;
      response.data = { address };

      logger.info('The IP was successfully removed.');
    } catch (error: any) {
      response.success = false;
      response.message = this.generateSecureErrorMessage(error);
    }

    logger.info('Finishing "unban-ip" use-case/service.');
    return response;
  }

  private generateSecureErrorMessage(error: Error) {
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

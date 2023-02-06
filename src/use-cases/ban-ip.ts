import { Error } from 'mongoose';
import { BannedIp } from '@models/banned-ip';
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
      response.success = true;
      response.data = { address: request.address };

      logger.info('The IP was successfully included.');
    } catch (error: any) {
      response.success = false;
      response.message = this.generateSecureErrorMessage(error);
    }

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
    return 'An unknown error was throwed, please report this issue!';
  }
}

export { BanIp, BanIpRequest, BanIpResponse };

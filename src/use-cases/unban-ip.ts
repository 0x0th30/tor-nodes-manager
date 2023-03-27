import { Error } from 'mongoose';
import { BannedIp } from '@models/banned-ip';
import { logger } from '@loaders/logger';

interface UnbanIpRequest {
  address: string,
}

interface UnbanIpResponse {
  success: boolean,
  message?: string,
  data?: { address: string },
}

class UnbanIp {
  public async execute(request: UnbanIpRequest): Promise<UnbanIpResponse> {
    logger.info('Initializing "unban-ip" use-case/service...');

    const response: UnbanIpResponse = { success: false };

    logger.info(`Removing IP ${request.address} from primary base...`);

    try {
      await BannedIp.deleteMany({ address: request.address });
      response.success = true;
      response.data = { address: request.address };

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

export { UnbanIp, UnbanIpRequest, UnbanIpResponse };

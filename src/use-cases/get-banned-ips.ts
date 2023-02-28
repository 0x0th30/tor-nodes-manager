import { Error } from 'mongoose';
import { BannedIp } from '@models/banned-ip';
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

      response.success = true;
      response.data = { addresses };

      logger.info('Banned IPs was successfully found.');
    } catch (error: any) {
      response.success = false;
      response.message = this.generateSecureErrorMessage(error);
    }

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

export { GetBannedIps, GetBannedIpsResponse };

import { GetAllIps } from '@use-cases/get-all-ips';
import { GetBannedIps } from '@use-cases/get-banned-ips';
import { logger } from '@loaders/logger';

interface GetFilteredIpsResponse {
  success: boolean,
  message?: string,
  data?: {
    results: number,
    bannedIps: number,
    addresses: string[],
  },
}

class GetFilteredIps {
  private getAllIps: GetAllIps;

  private getBannedIps: GetBannedIps;

  constructor(getAllIps: GetAllIps, getBannedIps: GetBannedIps) {
    this.getAllIps = getAllIps;
    this.getBannedIps = getBannedIps;
  }

  public async execute(): Promise<GetFilteredIpsResponse> {
    logger.info('Initializing "get-filtered-ips" use-case/service...');

    const response: GetFilteredIpsResponse = { success: false };

    logger.info('Getting all IPs...');
    const getAllIpsResponse = await this.getAllIps.execute();
    if (!getAllIpsResponse.success || !getAllIpsResponse.data) {
      response.success = false;
      response.message = getAllIpsResponse.message;

      return response;
    }

    logger.info('Getting banned IPs...');
    const getBannedIpsResponse = await this.getBannedIps.execute();
    if (!getBannedIpsResponse.success || !getBannedIpsResponse.data) {
      response.success = false;
      response.message = getBannedIpsResponse.message;

      return response;
    }

    const allIps = getAllIpsResponse.data.addresses;
    const bannedIps = getBannedIpsResponse.data.addresses;
    let bannedIpsCount = 0;

    logger.info('Removing banned IPs from listing...');
    const filteredIps: string[] = [];
    allIps.forEach((ip) => {
      if (!bannedIps.includes(ip)) filteredIps.push(ip);
      else bannedIpsCount += 1;
    });

    logger.info(`All ${bannedIpsCount} banned IPs was successfully hidden.`);
    response.success = true;
    response.data = {
      results: allIps.length,
      bannedIps: bannedIpsCount,
      addresses: filteredIps,
    };

    logger.info('Finishing "get-filtered-ips" use-case/service.');
    return response;
  }
}

export { GetFilteredIps, GetFilteredIpsResponse };

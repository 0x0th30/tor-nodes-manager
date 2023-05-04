import { GetAllIps } from '@use-cases/get-all-ips/get-all-ips.business';
import { GetBannedIps } from '@use-cases/get-banned-ips/get-banned-ips.business';
import { logger } from '@utils/logger';
import { GetFilteredIpsDTO } from './get-filtered-ips.d';

export class GetFilteredIps {
  constructor(
    private GetAllIpsBusiness: GetAllIps,
    private GetBannedIpsBusiness: GetBannedIps,
  ) {}

  public async execute(): Promise<GetFilteredIpsDTO> {
    logger.info('Initializing "get-filtered-ips" use-case/service...');

    const response: GetFilteredIpsDTO = { success: false };

    logger.info('Getting all IPs...');
    const getAllIpsResponse = await this.GetAllIpsBusiness.execute();
    if (!getAllIpsResponse.success || !getAllIpsResponse.data) {
      response.success = false;
      response.error = getAllIpsResponse.error;
      return response;
    }

    logger.info('Getting banned IPs...');
    const getBannedIpsResponse = await this.GetBannedIpsBusiness.execute();
    if (!getBannedIpsResponse.success || !getBannedIpsResponse.data) {
      response.success = false;
      response.error = getBannedIpsResponse.error;
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

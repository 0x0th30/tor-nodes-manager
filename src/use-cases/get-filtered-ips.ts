import { GetAllIps } from '@use-cases/get-all-ips';
import { GetBannedIps } from '@use-cases/get-banned-ips';

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
    const response: GetFilteredIpsResponse = { success: false };

    const getAllIpsResponse = await this.getAllIps.execute();
    if (!getAllIpsResponse.success || !getAllIpsResponse.data) {
      response.success = false;
      response.message = getAllIpsResponse.message;

      return response;
    }

    const getBannedIpsResponse = await this.getBannedIps.execute();
    if (!getBannedIpsResponse.success || !getBannedIpsResponse.data) {
      response.success = false;
      response.message = getBannedIpsResponse.message;

      return response;
    }

    const allIps = getAllIpsResponse.data.addresses;
    const bannedIps = getBannedIpsResponse.data.addresses;
    let bannedIpsCount = 0;

    const filteredIps: string[] = [];
    allIps.forEach((ip) => {
      if (!bannedIps.includes(ip)) filteredIps.push(ip);
      else bannedIpsCount += 1;
    });

    response.success = true;
    response.data = {
      results: allIps.length,
      bannedIps: bannedIpsCount,
      addresses: filteredIps,
    };

    return response;
  }
}

export { GetFilteredIps, GetFilteredIpsResponse };

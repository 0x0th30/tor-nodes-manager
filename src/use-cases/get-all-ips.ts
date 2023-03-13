import fs from 'fs';
import path from 'path';
import { RedisClientType } from '@redis/client';
import { OnionooAPI } from '@3rd-party/onionoo';
import { DanMeAPI } from '@3rd-party/dan-me-uk';
import { logger } from '@loaders/logger';
import { NodeListSourceError } from '@errors/node-list-source-error';

interface GetAllIpsResponse {
  success: boolean,
  message?: string,
  data?: {
    results: number,
    addresses: string[],
  },
}

class GetAllIps {
  private onionooClient: OnionooAPI;

  private danMeClient: DanMeAPI;

  private redisClient: RedisClientType<any>;

  constructor(onionoo: OnionooAPI, danMe: DanMeAPI, redis: RedisClientType<any>) {
    this.onionooClient = onionoo;
    this.danMeClient = danMe;
    this.redisClient = redis;
  }

  public async execute(): Promise<GetAllIpsResponse> {
    logger.info('Initializing "get-all-ips" use-case/service...');

    const response: GetAllIpsResponse = { success: false };

    try {
      const onionooIps = await this.getOnionooIps();
      const danMeIps = await this.getDanMeIps();

      response.data = { results: 0, addresses: [] };

      onionooIps.forEach((ip: string) => {
        if (ip) response.data?.addresses.push(ip);
      });
      danMeIps.forEach((ip: string) => {
        if (ip) response.data?.addresses.push(ip);
      });

      response.success = true;
      response.data.results = (onionooIps.length + danMeIps.length);
    } catch (error: any) {
      response.success = false;
      response.message = this.generateSecureErrorMessage(error);
    }

    logger.info('Finishing "get-all-ips" use-case/service.');
    return response;
  }

  private async getOnionooIps(): Promise<string[]> {
    logger.info('Requesting to Onionoo endpoint...');
    const requestedIps = await this.onionooClient.getNodeList();
    return requestedIps;
  }

  private async getDanMeIps(): Promise<string[]> {
    const cachedIPs = await this.searchByDanMeIpsInRedis();
    if (cachedIPs) return cachedIPs;

    const localStoredIpsPath = path.join(__dirname, '..', 'utils/backup-dan-me-ips.json');

    logger.info('Requesting to DanMe endpoint...');
    const requestedIps: string[] = await this.danMeClient.getNodeList();
    if (requestedIps.length !== 0) {
      this.storeDanMeIpsInRedis(requestedIps);

      logger.info('Updating DanMe ips in locally stored JSON file...');
      fs.writeFileSync(localStoredIpsPath, JSON.stringify({ ips: requestedIps }));

      return requestedIps;
    }

    logger.info('Searching by DanMe ips in locally stored JSON file...');
    const rawLocalStoredIps = fs.readFileSync(localStoredIpsPath);
    const localStoredIps = JSON.parse(rawLocalStoredIps.toString()).ips;
    return localStoredIps;
  }

  private async searchByDanMeIpsInRedis(): Promise<string[] | undefined> {
    logger.info('Searching by DanMe ips in Redis...');

    // 0 = first list element; -1 = last list element
    const cachedIps: string[] = await this.redisClient.lRange('danMeIps', 0, -1);
    if (cachedIps.length !== 0) return cachedIps;
    return undefined;
  }

  private async storeDanMeIpsInRedis(ipsToStore: string[]): Promise<void> {
    logger.info('Updating DanMe ips in Redis cache...');
    const expireTimeInSeconds = 1800; // 30 minutes
    await this.redisClient.rPush('danMeIps', ipsToStore);
    await this.redisClient.expire('danMeIps', expireTimeInSeconds);
  }

  private generateSecureErrorMessage(error: Error) {
    if (error instanceof NodeListSourceError) {
      switch (error.name) {
        case 'InvalidResponseFromSource':
          return `"${error.info.url}" sent status ${error.info.status}, try again later!`;
        case 'NoResponseFromSource':
          return `"${error.info.url}" sent ${error.info.code}, please report this issue!`;
        default:
          return `"${error.info.url}" communication error, please report this issue!`;
      }
    }

    return 'An internal/unknown error was throwed, please report this issue!';
  }
}

export { GetAllIps, GetAllIpsResponse };

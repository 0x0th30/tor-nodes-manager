import fs from 'fs';
import path from 'path';
import { RedisClientType } from '@redis/client';
import { OnionooAPI } from '@3rd-party/onionoo';
import { DanMeAPI } from '@3rd-party/dan-me-uk';
import { logger } from '@loaders/logger';
import { redisClient } from '@loaders/redis';

interface GetAllIpsResponse {
  success: boolean,
  message?: string,
  data: {
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

    const response: GetAllIpsResponse = {
      success: false,
      data: { results: 0, addresses: [] },
    };

    const onionooIps = await this.getOnionooIps();
    const danMeIps = await this.getDanMeIps();

    onionooIps.forEach((ip: string) => response.data.addresses.push(ip));
    danMeIps.forEach((ip: string) => response.data.addresses.push(ip));

    response.success = true;
    response.data.results = (onionooIps.length + danMeIps.length);

    logger.info('Finishing "get-all-ips" use-case/service.');
    return response;
  }

  private async getOnionooIps(): Promise<string[]> {
    logger.info('Requesting to Onionoo endpoint...');
    const requestedIps = await this.onionooClient.getNodeList();
    return requestedIps;
  }

  private async getDanMeIps(): Promise<string[]> {
    logger.info('Searching by DanMe ips in Redis...');
    const cachedIps: string[] = await this.redisClient.lRange('danMeIps', 0, -1);
    if (cachedIps.length !== 0) return cachedIps;

    const localStoredIpsPath = path.join(__dirname, '..', 'utils/backup-dan-me-ips.json');

    logger.info('Requesting to DanMe endpoint...');
    const requestedIps: string[] = await this.danMeClient.getNodeList();
    if (requestedIps.length !== 0) {
      logger.info('Updating DanMe ips in Redis cache...');
      const expireTimeInSeconds = 1800; // 30 minutes
      await this.redisClient.rPush('danMeIps', requestedIps);
      await this.redisClient.expire('danMeIps', expireTimeInSeconds);

      logger.info('Updating DanMe ips in locally stored JSON file...');
      fs.writeFileSync(localStoredIpsPath, JSON.stringify({ ips: requestedIps }));

      return requestedIps;
    }

    logger.info('Searching by DanMe ips in locally stored JSON file...');
    const rawLocalStoredIps = fs.readFileSync(localStoredIpsPath);
    const localStoredIps = JSON.parse(rawLocalStoredIps.toString()).ips;
    return localStoredIps;
  }
}

export { GetAllIps };

import { RedisClientType } from '@redis/client';
import { OnionooAPI } from 'src/3rd-party/onionoo';
import { DanMeAPI } from 'src/3rd-party/dan-me-uk';
import { logger } from '@loaders/logger';

interface GetAllIpsResponse {
  success: boolean,
  message?: string,
  data?: { addresses: string[] },
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
    const response: GetAllIpsResponse = { success: false, data: { addresses: [] } };

    await this.onionooClient.getNodeList()
      .then((addresses) => {
        addresses.forEach((ip) => response.data?.addresses.push(ip));
      })
      .catch((error) => {
        logger.error(`vishkk. Details: ${error}`);
      });

    await this.danMeClient.getNodeList()
      .then((addresses) => {})
      .catch((error) => {
        logger.error(`vishkk. Details: ${error}`);
      });

    return response;
  }
}

export { GetAllIps };

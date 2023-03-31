import { RedisClientType } from '@redis/client';
import { RabbitMQ } from '@loaders/rabbitmq';
import { logger } from '@loaders/logger';
import { InvalidResponseFromSource, NodeListSourceError, NoResponseFromSource }
  from '@errors/node-list-source-error';

interface GetAllIpsResponse {
  success: boolean,
  message?: string,
  data?: {
    results: number,
    addresses: string[],
  },
}

class GetAllIps {
  constructor(
    private redis: RedisClientType<any>,
    private rabbitmq: RabbitMQ,
  ) {}

  public async execute(): Promise<GetAllIpsResponse> {
    logger.info('Initializing "get-all-ips" use-case/service...');

    const response: GetAllIpsResponse = { success: false };

    try {
      response.data = { results: 0, addresses: [] };

      response.success = true;
      response.data.addresses = await this.getTorNodes();
      response.data.results = response.data.addresses.length;
    } catch (error: any) {
      response.success = false;
      response.message = this.generateSecureErrorMessage(error);
    }

    logger.info('Finishing "get-all-ips" use-case/service.');
    return response;
  }

  private async getTorNodes(): Promise<string[]> {
    const tornodes: string[] = await this.redis.lRange('tornodes', 0, -1);
    const tornodesTTL = await this.redis.ttl('tornodes');
    const minimumTTLToUpdateCache = 900; // 900s = 15min

    if (tornodes && tornodesTTL > minimumTTLToUpdateCache) return tornodes;
    if (tornodes && tornodesTTL <= minimumTTLToUpdateCache) {
      const queue = 'tornodes';
      const message = { getOnionooIps: true, getDanMeUkIps: true };
      this.rabbitmq.sendMessageToQueue(queue, message);

      return tornodes;
    }

    const queue = 'tornodes';
    const message = { getOnionooIps: true, getDanMeUkIps: true };
    this.rabbitmq.sendMessageToQueue(queue, message);
    return this.getTorNodes();
  }

  // private async getOnionooIps(): Promise<string[]> {
  //   logger.info('Requesting to Onionoo endpoint...');
  //   const requestedIps = await this.onionooClient.getNodeList();
  //   return requestedIps;
  // }

  // private async getDanMeIps(): Promise<string[]> {
  //   const cachedIPs = await this.searchByDanMeIpsInRedis();
  //   if (cachedIPs) return cachedIPs;

  //   const localStoredIpsPath = path.join(
  //     __dirname,
  //     '..',
  //     'utils/backup-dan-me-ips.json',
  //   );

  //   logger.info('Requesting to DanMe endpoint...');
  //   const requestedIps: string[] = await this.danMeClient.getNodeList();
  //   if (requestedIps.length !== 0) {
  //     this.storeDanMeIpsInRedis(requestedIps);

  //     logger.info('Updating DanMe ips in locally stored JSON file...');
  //     fs.writeFileSync(localStoredIpsPath, JSON.stringify({ ips: requestedIps }));

  //     return requestedIps;
  //   }

  //   logger.info('Searching by DanMe ips in locally stored JSON file...');
  //   const rawLocalStoredIps = fs.readFileSync(localStoredIpsPath);
  //   const localStoredIps = JSON.parse(rawLocalStoredIps.toString()).ips;
  //   return localStoredIps;
  // }

  // private async searchByDanMeIpsInRedis(): Promise<string[] | undefined> {
  //   logger.info('Searching by DanMe ips in Redis...');

  //   // 0 = first list element; -1 = last list element
  //   const cachedIps: string[] = await this.redisClient.lRange('danMeIps', 0, -1);
  //   if (cachedIps.length !== 0) return cachedIps;
  //   return undefined;
  // }

  // private async storeDanMeIpsInRedis(ipsToStore: string[]): Promise<void> {
  //   logger.info('Updating DanMe ips in Redis cache...');
  //   const expireTimeInSeconds = 1800; // 30 minutes
  //   await this.redisClient.rPush('danMeIps', ipsToStore);
  //   await this.redisClient.expire('danMeIps', expireTimeInSeconds);
  // }

  private generateSecureErrorMessage(error: Error) {
    if (error instanceof InvalidResponseFromSource) {
      return `"${error.info.url}" sent status ${error.info.status}, try again later!`;
    }
    if (error instanceof NoResponseFromSource) {
      return `"${error.info.url}" sent ${error.info.code}, please report this issue!`;
    }
    if (error instanceof NodeListSourceError) {
      return `"${error.info.url}" communication error, please report this issue!`;
    }

    return 'An internal/unknown error was throwed, please report this issue!';
  }
}

export { GetAllIps, GetAllIpsResponse };

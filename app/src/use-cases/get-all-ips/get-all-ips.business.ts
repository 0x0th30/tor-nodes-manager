import { RedisClientType } from '@redis/client';
import { RabbitMQ } from '@loaders/rabbitmq';
import { logger } from '@utils/logger';
import { InvalidResponseFromSource, NodeListSourceError, NoResponseFromSource }
  from '@errors/node-list-source-error';
import { GetAllIpsDTO } from './get-all-ips.d';

export class GetAllIps {
  constructor(
    private redis: RedisClientType<any>,
    private rabbitmq: RabbitMQ,
  ) {}

  public async execute(): Promise<GetAllIpsDTO> {
    logger.info('Initializing "get-all-ips" use-case/service...');

    const response: GetAllIpsDTO = { success: false };

    await this.getTorNodes()
      .then((addresses) => {
        response.success = true;
        response.data = { addresses, results: addresses.length };
      })
      .catch((error) => {
        response.success = false;
        response.error = error;
      });

    logger.info('Finishing "get-all-ips" use-case/service.');
    return response;
  }

  private async getTorNodes(): Promise<string[]> {
    const tornodes: string[] = await this.redis.lRange('tornodes', 0, -1);
    const tornodesTTL = await this.redis.ttl('tornodes');
    const minimumTTLToUpdateCache = 900; // 900s = 15min

    const queue = 'tornodes';
    const queueSize = await this.rabbitmq.getQueueSize(queue);

    if (queueSize > 0) return this.getTorNodes();
    if (tornodes && tornodesTTL > minimumTTLToUpdateCache) return tornodes;
    if (tornodes && tornodesTTL <= minimumTTLToUpdateCache && queueSize === 0) {
      const message = { getOnionooIps: true, getDanMeUkIps: true };
      this.rabbitmq.sendMessageToQueue(queue, message);

      return tornodes;
    }

    return this.getTorNodes();
  }

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

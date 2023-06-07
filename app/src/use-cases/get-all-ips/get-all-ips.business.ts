import { RedisClientType } from '@redis/client';
import { RabbitMQ } from '@loaders/rabbitmq';
import { logger } from '@utils/logger';
import { ProcessingNodeList } from '@errors/node-list-source-error';
import { GetAllIpsDTO } from './get-all-ips.d';

export class GetAllIps {
  constructor(
    private RedisClient: RedisClientType<any>,
    private RabbitMQClient: RabbitMQ,
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
    const tornodes: string[] = await this.RedisClient.lRange('tornodes', 0, -1);
    const tornodesTTL = await this.RedisClient.ttl('tornodes');
    const minimumTTLToUpdateCache = 900; // 900s = 15min

    const queue = 'tornodes';
    const queueSize = await this.RabbitMQClient.getQueueSize(queue);

    if (tornodes && tornodesTTL > minimumTTLToUpdateCache) return tornodes;
    if (
      (tornodes && tornodesTTL <= minimumTTLToUpdateCache && queueSize === 0)
      || (!tornodes && queueSize === 0)
    ) {
      const message = { getOnionooIps: true, getDanMeUkIps: true };
      await this.RabbitMQClient.sendMessageToQueue(queue, message);
    }

    throw new ProcessingNodeList();
  }
}

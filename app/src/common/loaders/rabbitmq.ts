import amqp from 'amqplib/callback_api';
import { logger } from '@utils/logger';

class RabbitMQ {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  private readonly uri: string = process.env['RABBITMQ_URI']!;

  public sendMessageToQueue(queue: string, message: object): Promise<void> {
    return new Promise((resolve, reject) => {
      logger.info('Connecting into AMQP client...');
      amqp.connect(this.uri, (connectionError, connection) => {
        if (connectionError) reject(connectionError);

        logger.info('Creating channel in AMQP client...');
        connection.createChannel((channelError, channel) => {
          if (channelError) reject(channelError);

          logger.info(`Sending message to "${queue}"...`);
          channel.assertQueue(queue, { durable: false });
          channel.sendToQueue(queue, this.objectToBuffer(message));
          resolve();
        });
      });
    });
  }

  public getQueueSize(queue: string): Promise<number> {
    return new Promise((resolve, reject) => {
      logger.info('Connecting into AMQP client...');
      amqp.connect(this.uri, (connectionError, connection) => {
        if (connectionError) reject(connectionError);

        logger.info('Creating channel in AMQP client...');
        connection.createChannel((channelError, channel) => {
          if (channelError) reject(channelError);

          logger.info(`Checking ${queue} queue size...`);
          channel.assertQueue(queue, { durable: false });
          channel.checkQueue(queue, (_error, ok) => {
            if (ok) resolve(ok.messageCount);
            else resolve(0);
          });
        });
      });
    });
  }

  private objectToBuffer(object: object): Buffer {
    const stringiedObject = JSON.stringify(object);
    const buffer = Buffer.from(stringiedObject);
    return buffer;
  }
}

export { RabbitMQ };

import amqp from 'amqplib/callback_api';
import { DanMeAPI } from '@providers/dan-me-uk';
import { OnionooAPI } from '@providers/onionoo';
import { redisClient } from '@providers/redis';
import { logger } from '@utils/logger';

export class TornodesProcessor {
  private queueName = 'tornodes'
  private rabbitmqURI = process.env['RABBITMQ_URI']!;
  private DanMeProvider = new DanMeAPI();
  private OnionooProvider = new OnionooAPI();

  public start(): void {    
    logger.info('Connecting into RabbitMQ client...');
    amqp.connect(this.rabbitmqURI, (connectionError, connection) => {
      if (connectionError) {
        logger.error(`Cannot connect RabbitMQ client. Details: "${connectionError}"`);
        return this.start();
      }
      
      logger.info('Successfully connected with RabbitMQ client. Creating channel...');
      connection.createChannel((channelError, channel) => {
        if (channelError) {
          logger.error(`Cannot create channel. Details: "${connectionError}"`);
          throw channelError;
        }
        
        logger.info(`Connecting into "${this.queueName}" queue...`);
        channel.assertQueue(this.queueName, { durable: false });
        channel.consume(this.queueName, async (message) => {
          logger.info(`Successfully connected with "${this.queueName}" queue.`);
          const tornodes: Array<string> = [];
          const jsonfiedMessage = JSON.parse(message!.content.toString());
          console.log(jsonfiedMessage)
    
          if (jsonfiedMessage.getOnionooIps) {
            await this.OnionooProvider.getNodeList()
              .then((nodeList) => {
                nodeList.forEach((nodeIp) => tornodes.push(nodeIp));
              });
          }
    
          if (jsonfiedMessage.getDanMeUkIps) {
            await this.DanMeProvider.getNodeList()
              .then((nodeList) => {
                nodeList.forEach((nodeIp) => tornodes.push(nodeIp));
              });
          }
    
          const expireTimeInSeconds = 2700; // 45 minutes
    
          logger.info('Caching obtained IPs...')
          await redisClient.rPush('tornodes', tornodes);
          await redisClient.expire('tornodes', expireTimeInSeconds);
        });
      });
    });
  }
}
import amqp from 'amqplib/callback_api';
import { DanMeAPI } from '@providers/dan-me-uk';
import { OnionooAPI } from '@providers/onionoo';
import { redisClient } from '@providers/redis';
import { logger } from '@utils/logger';

logger.info('Setting up external providers...');
const danMeProvider = new DanMeAPI();
const onionooProvider = new OnionooAPI();

const queue = 'tornodes'
const uri = process.env['RABBITMQ_URI']!;

logger.info('Connecting into RabbitMQ client...');
amqp.connect(uri, (connectionError, connection) => {
  if (connectionError) {
    logger.error(`Cannot connect RabbitMQ client. Details: "${connectionError}"`);
    throw connectionError;
  }
  
  logger.info('Successfully connected with RabbitMQ client. Creating channel...');
  connection.createChannel((channelError, channel) => {
    if (channelError) {
      logger.error(`Cannot create channel. Details: "${connectionError}"`);
      throw connectionError;
    }
    
    logger.info(`Connecting into "${queue}" queue...`);
    channel.assertQueue(queue, { durable: false });
    channel.consume(queue, async (message) => {
      logger.info(`Successfully connected with "${queue}" queue.`);
      const tornodes: Array<string> = [];
      const jsonfiedMessage = JSON.parse(message!.content.toString());
      console.log(jsonfiedMessage)

      if (jsonfiedMessage.getOnionooIps) {
        await onionooProvider.getNodeList()
          .then((nodeList) => {
            nodeList.forEach((nodeIp) => tornodes.push(nodeIp));
          });
      }

      if (jsonfiedMessage.getDanMeUkIps) {
        await danMeProvider.getNodeList()
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
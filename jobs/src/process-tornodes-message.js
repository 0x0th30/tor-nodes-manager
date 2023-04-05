const amqp = require('amqplib/callback_api');
const onionooAPI = require('./providers/onionoo');
const danMeUkAPI = require('./providers/dan-me-uk');
const redis = require('./providers/redis');

const queue = 'tornodes'
// const uri = process.env['RABBITMQ_URI'];
const uri = 'amqp://user:password@localhost:5672';
console.log(uri);

amqp.connect(uri, (connectionError, connection) => {
  if (connectionError) throw connectionError;

  connection.createChannel((channelError, channel) => {
    if (channelError) throw channelError;

    channel.consume(queue, async (message) => {
      console.log('dentro da queue');
      const tornodes = [];
      const jsonfiedMessage = JSON.parse(message.content.toString());
      console.log(jsonfiedMessage)

      if (jsonfiedMessage.getOnionooIps) {
        console.log('pegando ips da onionoo');
        await onionooAPI.getNodeList()
          .then((nodeList) => {
            nodeList.forEach((nodeIp) => tornodes.push(nodeIp));
          });
      }

      // if (jsonfiedMessage.getDanMeUkIps) {
      //   console.log('pegando ips da dan me uk');
      //   await danMeUkAPI.getNodeList()
      //     .then((nodeList) => {
      //       nodeList.forEach((nodeIp) => tornodes.push(nodeIp));
      //     });
      // }

      const expireTimeInSeconds = 2700; // 45 minutes

      console.log('cacheando ips');

      console.log(tornodes.length);
      await redis.rPush('tornodes', tornodes);
      await redis.expire('tornodes', expireTimeInSeconds);
    });
  });
});
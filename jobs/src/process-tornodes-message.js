const amqp = require('amqplib/callback_api');
const onionooAPI = require('./providers/onionoo');
const danMeUkAPI = require('./providers/dan-me-uk');

const queue = 'tornodes'
const uri = 'amqp://user:password@rabbitmq:5672';

amqp.connect(uri, (connectionError, connection) => {
  if (connectionError) throw connectionError;

  connection.createChannel((channelError, channel) => {
    if (channelError) throw channelError;

    channel.consume(queue, async (message) => {
      console.log('dentro da queue')

      const response = [];
      const jsonfiedMessage = message.content.toJSON();

      if (jsonfiedMessage.getOnionooIps) {
        await onionooAPI.getNodeList().then(value => response.push(value));
      }

      if (jsonfiedMessage.getDanMeUkIps) {
        await danMeUkAPI.getNodeList().then(value => response.push(value));
      }

      return response;
    });
  });
});

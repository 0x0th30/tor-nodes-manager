const amqp = require('amqplib/callback_api');

const queue = 'tornodes'
const uri = process.env['RABBITMQ_URI'];

amqp.connect(uri, (connectionError, connection) => {
  if (connectionError) throw connectionError;

  connection.createChannel((channelError, channel) => {
    if (channelError) throw channelError;

    channel.consume(queue, (message) => {
      const response = [];
      const jsonfiedMessage = message.toJSON();

      if (jsonfiedMessage.getOnionooIps) {
        // get onionoo ips code here
      }

      if (jsonfiedMessage.getDanMeUkIps) {
        // get dan me uk ips code here
      }

      return response;
    });
  });
});

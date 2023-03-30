import amqp from 'amqplib/callback_api';

class RabbitMQ {
  private readonly uri: string = process.env['RABBITMQ_URI']!;

  public sendMessageToQueue(queue: string, message: object): void {
    amqp.connect(this.uri, (connectionError, connection) => {
      if (connectionError) throw connectionError;

      connection.createChannel((channelError, channel) => {
        if (channelError) throw channelError;

        channel.assertQueue(queue, { durable: false });
        channel.sendToQueue(queue, this.objectToBuffer(message));
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

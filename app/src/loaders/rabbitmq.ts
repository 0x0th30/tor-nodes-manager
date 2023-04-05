import amqp from 'amqplib/callback_api';

class RabbitMQ {
  private readonly uri: string = process.env['RABBITMQ_URI']!;

  public sendMessageToQueue(queue: string, message: object): void {
    console.log('sendMessageToQueue');
    amqp.connect(this.uri, (connectionError, connection) => {
      if (connectionError) throw connectionError;

      connection.createChannel((channelError, channel) => {
        if (channelError) throw channelError;

        channel.assertQueue(queue, { durable: false });
        channel.sendToQueue(queue, this.objectToBuffer(message));
      });
      connection.close();
    });
  }

  public getQueueSize(queue: string): Promise<number> {
    console.log('getQueueSize');
    return new Promise((resolve) => {
      amqp.connect(this.uri, (connectionError, connection) => {
        if (connectionError) throw connectionError;

        connection.createChannel((channelError, channel) => {
          if (channelError) console.log(channelError);

          channel.checkQueue(queue, (_error, ok) => {
            if (ok) resolve(ok.messageCount);
            else resolve(0);
          });
        });
        connection.close();
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

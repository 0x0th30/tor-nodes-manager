import { RabbitMQ } from '@loaders/rabbitmq';

export const RabbitMQMock = {
  sendMessageToQueue: jest.spyOn(RabbitMQ.prototype, 'sendMessageToQueue'),
  getQueueSize: jest.spyOn(RabbitMQ.prototype, 'getQueueSize'),
  objectToBuffer: jest.spyOn((RabbitMQ as any).prototype, 'objectToBuffer'),
};

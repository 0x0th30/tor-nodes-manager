import { RedisClientType } from '@redis/client';
import { GetAllIps } from '@use-cases/get-all-ips/get-all-ips.business';
import { GetAllIpsMock } from '@mocks/get-all-ips';
import { RedisClientMock } from '@mocks/redis';
import { RabbitMQMock } from '@mocks/rabbitmq';
import { RabbitMQ } from '@loaders/rabbitmq';
import { ProcessingNodeList } from '@errors/node-list-source-error';

const GetAllIpsSUT = new GetAllIps(
  RedisClientMock as unknown as RedisClientType,
  RabbitMQMock as unknown as RabbitMQ,

);

describe('"GetAllIps" class', () => {
  describe('(public) "execute" method', () => {
    it('should call "this.getTorNodes" private method', () => {
      GetAllIpsMock.getTorNodes.mockResolvedValue(undefined);

      GetAllIpsSUT.execute().then(() => {
        expect(GetAllIpsMock.getTorNodes).toBeCalled();
      });
    });
    it('should return a successfully response if get all IPs', () => {
      GetAllIpsMock.getTorNodes.mockResolvedValue(['4.4.4.4', '8.8.8.8']);

      GetAllIpsSUT.execute().then((response) => {
        expect(response).toEqual({
          success: true,
          data: { addresses: ['4.4.4.4', '8.8.8.8'], results: 2 },
        });
      });
    });
    it('should return a failure response if something fail during search', () => {
      GetAllIpsMock.getTorNodes.mockRejectedValue(new Error('foo bar'));

      GetAllIpsSUT.execute().then((response) => {
        expect(response).toEqual({
          success: false,
          error: new Error('foo bar'),
        });
      });
    });
  });
  describe('(private) "getTorNodes" method', () => {
    it('should call "RedisClientMock.lRange" search by IPs in Redis', () => {
      GetAllIpsMock.getTorNodes.mockRestore();
      RedisClientMock.lRange.mockResolvedValue(['4.4.4.4']);
      RedisClientMock.ttl.mockResolvedValue(901);
      RabbitMQMock.getQueueSize.mockResolvedValue(0);
      RabbitMQMock.sendMessageToQueue.mockResolvedValue();

      (GetAllIpsSUT as any).getTorNodes().then(() => {
        expect(RedisClientMock.lRange).toBeCalled();
      });
    });
    it('should call "RedisClientMock.ttl" get IPs TTL in Redis', () => {
      GetAllIpsMock.getTorNodes.mockRestore();
      RedisClientMock.lRange.mockResolvedValue(['4.4.4.4']);
      RedisClientMock.ttl.mockResolvedValue(901);
      RabbitMQMock.getQueueSize.mockResolvedValue(0);
      RabbitMQMock.sendMessageToQueue.mockResolvedValue();

      (GetAllIpsSUT as any).getTorNodes().then(() => {
        expect(RedisClientMock.ttl).toBeCalled();
      });
    });
    it('should call "RabbitMQMock.getQueueSize" to check queue size in RabbitMQ', () => {
      GetAllIpsMock.getTorNodes.mockRestore();
      RedisClientMock.lRange.mockResolvedValue(['4.4.4.4']);
      RedisClientMock.ttl.mockResolvedValue(901);
      RabbitMQMock.getQueueSize.mockResolvedValue(0);
      RabbitMQMock.sendMessageToQueue.mockResolvedValue();

      (GetAllIpsSUT as any).getTorNodes().then(() => {
        expect(RabbitMQMock.getQueueSize).toBeCalled();
      });
    });
    it('should return IPs if exists in Redis and TTL was bigger than 15 minutes', () => {
      GetAllIpsMock.getTorNodes.mockRestore();
      RedisClientMock.lRange.mockResolvedValue(['4.4.4.4']);
      RedisClientMock.ttl.mockResolvedValue(901); // 900s = 15min
      RabbitMQMock.getQueueSize.mockResolvedValue(0);
      RabbitMQMock.sendMessageToQueue.mockResolvedValue();

      (GetAllIpsSUT as any).getTorNodes().then((response: Array<string>) => {
        expect(response).toEqual(['4.4.4.4']);
      });
    });
    it('should call "RabbitMQClient.sendMessageToQueue" if exists in Redis but TTL was'
        + ' less than 15 minutes', () => {
      GetAllIpsMock.getTorNodes.mockRestore();
      RedisClientMock.lRange.mockResolvedValue(['4.4.4.4']);
      RedisClientMock.ttl.mockResolvedValue(899); // 900s = 15min
      RabbitMQMock.getQueueSize.mockResolvedValue(0);
      RabbitMQMock.sendMessageToQueue.mockResolvedValue();

      (GetAllIpsSUT as any).getTorNodes().catch(() => {
        expect(RabbitMQMock.sendMessageToQueue).toBeCalled();
      });
    });
    it('should throw "ProcessingNodeList" if IPs already was send to be processed'
        + ' in queue', () => {
      GetAllIpsMock.getTorNodes.mockRestore();
      RedisClientMock.lRange.mockResolvedValue(['4.4.4.4']);
      RedisClientMock.ttl.mockResolvedValue(899); // 900s = 15min
      RabbitMQMock.getQueueSize.mockResolvedValue(0);
      RabbitMQMock.sendMessageToQueue.mockResolvedValue();

      (GetAllIpsSUT as any).getTorNodes().catch((error: any) => {
        expect(error).toEqual(new ProcessingNodeList());
      });
    });
  });
});

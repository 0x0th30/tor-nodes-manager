import { RedisClientType } from '@redis/client';
import { GetAllIps } from '@use-cases/get-all-ips/get-all-ips.business';
import { GetAllIpsMock } from '@mocks/get-all-ips';
import { RedisClientMock } from '@mocks/redis';
import { RabbitMQMock } from '@mocks/rabbitmq';
import { RabbitMQ } from '@loaders/rabbitmq';

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
});

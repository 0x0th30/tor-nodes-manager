import { Error } from 'mongoose';
import { BannedIpMock } from '@mocks/banned-ip';
import { GetBannedIps } from '@use-cases/get-banned-ips/get-banned-ips.business';

const GetBannedIpsSUT = new GetBannedIps();

describe('"GetBannedIps" class', () => {
  describe('(public) "execute" method', () => {
    it('should call "BannedIp.find" to search by all IPs', async () => {
      BannedIpMock.find.mockResolvedValue([]);

      await GetBannedIpsSUT.execute().then(() => {
        expect(BannedIpMock.find).toBeCalled();
        expect(BannedIpMock.find).toBeCalledWith({});
      });
    });
    it('should return a successfully response if it can search by IPs', async () => {
      const response = {
        success: true,
        data: { addresses: ['4.4.4.4', '8.8.8.8'] },
      };

      BannedIpMock.find.mockResolvedValue([
        { address: '4.4.4.4' },
        { address: '8.8.8.8' },
      ]);

      await GetBannedIpsSUT.execute().then((value) => {
        expect(value).toEqual(response);
      });
    });
    it('should return a failure response if something fail during search', async () => {
      const response = {
        success: false,
        error: new Error('foo bar'),
      };

      BannedIpMock.find.mockRejectedValue(new Error('foo bar'));

      await GetBannedIpsSUT.execute().then((value) => {
        expect(value).toEqual(response);
      });
    });
  });
});

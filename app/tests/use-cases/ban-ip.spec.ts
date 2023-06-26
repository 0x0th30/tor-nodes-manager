import { Error } from 'mongoose';
import { BanIp } from '@use-cases/ban-ip/ban-ip.business';
import { BannedIpMock } from '@mocks/banned-ip';

const BanIpSUT = new BanIp();

describe('"BanIp" class', () => {
  describe('(public) "execute" method', () => {
    it('should call "BannedIp.create" to include IP in database', async () => {
      const request = '8.8.8.8';

      BannedIpMock.create.mockResolvedValue(
        { address: '8.8.8.8', _id: 'any object id', __v: 0 } as never,
      );

      await BanIpSUT.execute(request).then(() => {
        expect(BannedIpMock.create).toBeCalledWith({ address: '8.8.8.8' });
      });
    });
    it('should return a successfully response if IP was added in base', async () => {
      const address = '8.8.8.8';
      const response = { success: true, data: { address: '8.8.8.8' } };

      BannedIpMock.create.mockResolvedValue(
        { address: '8.8.8.8', _id: 'any object id', __v: 0 } as never,
      );

      await BanIpSUT.execute(address).then((value) => {
        expect(value).toEqual(response);
      });
    });
    it('should return a failure response in case of something went wrong', async () => {
      const address = '8.8.8.8';
      const response = { success: false, error: new Error('foo bar') };

      BannedIpMock.create.mockRejectedValue(new Error('foo bar') as never);

      await BanIpSUT.execute(address).then((value) => {
        expect(value).toEqual(response);
      });
    });
  });
});

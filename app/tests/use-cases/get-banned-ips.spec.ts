import { Error } from 'mongoose';
import { BannedIpMock } from '@mocks/banned-ip';
import { GetBannedIpsMock } from '@mocks/get-banned-ips';
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
        message: 'generic message here',
      };

      BannedIpMock.find.mockImplementation(() => { throw new Error('foo bar'); });
      GetBannedIpsMock.generateSecureErrorMessage.mockReturnValue('generic message here');

      await GetBannedIpsSUT.execute().then((value) => {
        expect(value).toEqual(response);
      });
    });
    describe('(private) "generateSecureErrorMessage" method', () => {
      it('should return message according throwed error', async () => {
        GetBannedIpsMock.generateSecureErrorMessage.mockRestore();

        let error;
        let expectedMessage: string;
        let generatedMessage: string;

        error = new Error.MongooseServerSelectionError('foo bar');
        expectedMessage = 'Database connection error, please report this issue!';
        generatedMessage = (GetBannedIpsSUT as any).generateSecureErrorMessage(error);
        expect(generatedMessage).toEqual(expectedMessage);

        error = new Error.DocumentNotFoundError('foo bar');
        expectedMessage = 'Database internal error, please report this issue!';
        generatedMessage = (GetBannedIpsSUT as any).generateSecureErrorMessage(error);
        expect(generatedMessage).toEqual(expectedMessage);

        error = new Error('foo bar');
        expectedMessage = 'An internal/unknown error was throwed, please report'
          + ' this issue!';
        generatedMessage = (GetBannedIpsSUT as any).generateSecureErrorMessage(error);
        expect(generatedMessage).toEqual(expectedMessage);
      });
    });
  });
});

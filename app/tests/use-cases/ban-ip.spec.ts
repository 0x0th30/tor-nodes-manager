import { Error } from 'mongoose';
import { BanIp, BanIpRequest, BanIpResponse } from '@use-cases/ban-ip';
import { BanIpMock } from '@mocks/ban-ip';
import { BannedIpMock } from '@mocks/banned-ip';

const BanIpSUT = new BanIp();

describe('"BanIp" class', () => {
  describe('(public) "execute" method', () => {
    it('should call "BannedIp.create" to include IP in database', async () => {
      const request: BanIpRequest = { address: '8.8.8.8' };

      BannedIpMock.create.mockResolvedValue(undefined as never);

      await BanIpSUT.execute(request).then(() => {
        expect(BannedIpMock.create).toBeCalledWith({ address: '8.8.8.8' });
      });
    });
    it('should return a successfully response if IP was added in base', async () => {
      const request: BanIpRequest = { address: '8.8.8.8' };
      const response: BanIpResponse = { success: true, data: { address: '8.8.8.8' } };

      BannedIpMock.create.mockResolvedValue(undefined as never);

      await BanIpSUT.execute(request).then((value) => {
        expect(value).toEqual(response);
      });
    });
    it('should return a failure response in case of something went wrong', async () => {
      const request: BanIpRequest = { address: '8.8.8.8' };
      const response: BanIpResponse = { success: false, message: 'generic message here' };

      BannedIpMock.create.mockImplementation(() => { throw new Error('foo bar'); });
      BanIpMock.generateSecureErrorMessage.mockReturnValue('generic message here');

      await BanIpSUT.execute(request).then((value) => {
        expect(value).toEqual(response);
      });
    });
  });
  describe('(private) "generateSecureErrorMessage" method', () => {
    it('should return message according throwed error', async () => {
      BanIpMock.generateSecureErrorMessage.mockRestore();

      let error;
      let expectedMessage: string;
      let generatedMessage: string;

      error = new Error.MongooseServerSelectionError('foo bar');
      expectedMessage = 'Database connection error, please report this issue!';
      generatedMessage = (BanIpSUT as any).generateSecureErrorMessage(error);
      expect(generatedMessage).toEqual(expectedMessage);

      error = new Error.DocumentNotFoundError('foo bar');
      expectedMessage = 'Database internal error, please report this issue!';
      generatedMessage = (BanIpSUT as any).generateSecureErrorMessage(error);
      expect(generatedMessage).toEqual(expectedMessage);

      // duplicate key error code
      error = new Error('E11000');
      expectedMessage = 'This IP it\'s already registered.';
      generatedMessage = (BanIpSUT as any).generateSecureErrorMessage(error);
      expect(generatedMessage).toEqual(expectedMessage);

      error = new Error('foo bar');
      expectedMessage = 'An internal/unknown error was throwed, please report'
        + ' this issue!';
      generatedMessage = (BanIpSUT as any).generateSecureErrorMessage(error);
      expect(generatedMessage).toEqual(expectedMessage);
    });
  });
});

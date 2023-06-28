import { GetAllIpsMock } from '@mocks/get-all-ips';
import { GetBannedIpsMock } from '@mocks/get-banned-ips';
import { GetFilteredIps } from '@use-cases/get-filtered-ips/get-filtered-ips.business';
import { GetAllIps } from '@use-cases/get-all-ips/get-all-ips.business';
import { GetBannedIps } from '@use-cases/get-banned-ips/get-banned-ips.business';

const GetFilteredIpsSUT = new GetFilteredIps(
  GetAllIpsMock as unknown as GetAllIps,
  GetBannedIpsMock as unknown as GetBannedIps,
);

describe('"GetFilteredIps" class', () => {
  describe('(public) "execute" method', () => {
    it('should call "GetAllIps.execute" to get all IPs from sources', () => {
      GetAllIpsMock.execute.mockResolvedValue({
        success: true,
        data: { results: 2, addresses: ['4.4.4.4', '8.8.8.8'] },
      });
      GetBannedIpsMock.execute.mockResolvedValue({
        success: true,
        data: { addresses: ['4.4.4.4'] },
      });

      GetFilteredIpsSUT.execute().then(() => {
        expect(GetAllIpsMock.execute).toBeCalled();
      });
    });
    it('should call "GetBannedIps.execute" to get all banned IPs', () => {
      GetAllIpsMock.execute.mockResolvedValue({
        success: true,
        data: { results: 2, addresses: ['4.4.4.4', '8.8.8.8'] },
      });
      GetBannedIpsMock.execute.mockResolvedValue({
        success: true,
        data: { addresses: ['4.4.4.4'] },
      });

      GetFilteredIpsSUT.execute().then(() => {
        expect(GetBannedIpsMock.execute).toBeCalled();
      });
    });
    it('should replicate "GetAllIps.execute" error if exists', () => {
      GetAllIpsMock.execute.mockResolvedValue({
        success: false,
        error: new Error('foo bar'),
      });
      GetBannedIpsMock.execute.mockResolvedValue({
        success: true,
        data: { addresses: ['4.4.4.4'] },
      });

      GetFilteredIpsSUT.execute().then((response) => {
        expect(response).toEqual({ success: false, error: new Error('foo bar') });
      });
    });
    it('should replicate "GetBannedIps.execute" error if exists', () => {
      GetAllIpsMock.execute.mockResolvedValue({
        success: true,
        data: { results: 2, addresses: ['4.4.4.4', '8.8.8.8'] },
      });
      GetBannedIpsMock.execute.mockResolvedValue({
        success: false,
        error: new Error('foo bar'),
      });

      GetFilteredIpsSUT.execute().then((response) => {
        expect(response).toEqual({ success: false, error: new Error('foo bar') });
      });
    });
    it('should remove banned IPs from listing', () => {
      GetAllIpsMock.execute.mockResolvedValue({
        success: true,
        data: { results: 2, addresses: ['4.4.4.4', '8.8.8.8'] },
      });
      GetBannedIpsMock.execute.mockResolvedValue({
        success: true,
        data: { addresses: ['4.4.4.4'] },
      });

      GetFilteredIpsSUT.execute().then((response) => {
        expect(response).toEqual({
          success: true,
          data: { results: 2, bannedIps: 1, addresses: ['8.8.8.8'] },
        });
      });
    });
  });
});

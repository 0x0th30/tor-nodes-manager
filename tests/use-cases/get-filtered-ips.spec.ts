import { GetFilteredIps } from '@use-cases/get-filtered-ips';
import { GetAllIps } from '@use-cases/get-all-ips';
import { GetBannedIps } from '@use-cases/get-banned-ips';
import { GetAllIpsMock } from '@mocks/get-all-ips';
import { GetBannedIpsMock } from '@mocks/get-banned-ips';

const GetFilteredIpsSUT = new GetFilteredIps(
  GetAllIpsMock as unknown as GetAllIps,
  GetBannedIpsMock as unknown as GetBannedIps,
);

describe('"GetFilteredIps" class', () => {
  describe('(public) "execute" method', () => {
    it.todo('should call "getAllIps.execute" to get all IPs from sources');
    it.todo('should call "getBannedIps.execute" to get all banned IPs');
  });
});

import { GetBannedIps } from '@use-cases/get-banned-ips/get-banned-ips.business';

export const GetBannedIpsMock = {
  execute: jest.spyOn(GetBannedIps.prototype, 'execute'),
};

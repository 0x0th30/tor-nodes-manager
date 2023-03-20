import { GetBannedIps } from '@use-cases/get-banned-ips';

export const GetBannedIpsMock = {
  execute: jest.spyOn(GetBannedIps.prototype, 'execute'),
  generateSecureErrorMessage: jest
    .spyOn((GetBannedIps as any).prototype, 'generateSecureErrorMessage'),
};

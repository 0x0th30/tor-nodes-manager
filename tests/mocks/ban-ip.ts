import { BanIp } from '@use-cases/ban-ip';

export const BanIpMock = {
  execute: jest.spyOn(BanIp.prototype, 'execute'),
  generateSecureErrorMessage: jest
    .spyOn((BanIp as any).prototype, 'generateSecureErrorMessage'),
};

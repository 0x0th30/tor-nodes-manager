import { BanIp } from '@use-cases/ban-ip/ban-ip.business';

export const BanIpMock = {
  execute: jest.spyOn(BanIp.prototype, 'execute'),
};

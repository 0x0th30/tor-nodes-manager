import { BannedIp } from '@models/banned-ip';

export const BannedIpMock = {
  create: jest.spyOn(BannedIp, 'create'),
  find: jest.spyOn(BannedIp, 'find'),
};

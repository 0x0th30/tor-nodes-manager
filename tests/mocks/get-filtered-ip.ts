import { GetFilteredIps } from '@use-cases/get-filtered-ips';

export const GetFilteredIpsMock = {
  execute: jest.spyOn(GetFilteredIps.prototype, 'execute'),
};

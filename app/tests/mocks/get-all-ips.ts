import { GetAllIps } from '@use-cases/get-all-ips/get-all-ips.business';

export const GetAllIpsMock = {
  execute: jest.spyOn(GetAllIps.prototype, 'execute'),
  getTorNodes: jest.spyOn((GetAllIps as any).prototype, 'getTorNodes'),
};

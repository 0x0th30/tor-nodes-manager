import { GetAllIps } from '@use-cases/get-all-ips';

export const GetAllIpsMock = {
  execute: jest.spyOn(GetAllIps.prototype, 'execute'),
  getOnionooIps: jest.spyOn((GetAllIps as any).prototype, 'getOnionooIps'),
  getDanMeIps: jest.spyOn((GetAllIps as any).prototype, 'getDanMeIps'),
  searchByDanMeIpsInRedis: jest
    .spyOn((GetAllIps as any).prototype, 'searchByDanMeIpsInRedis'),
  storeDanMeIpsInRedis: jest.spyOn((GetAllIps as any).prototype, 'storeDanMeIpsInRedis'),
  generateSecureErrorMessage: jest
    .spyOn((GetAllIps as any).prototype, 'generateSecureErrorMessage'),
};

import { DanMeAPI } from '@3rd-party/dan-me-uk';

export const DanMeAPIMock = {
  getNodeList: jest.spyOn(DanMeAPI.prototype, 'getNodeList'),
};

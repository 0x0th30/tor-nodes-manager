import { DanMeAPI } from '@providers/dan-me-uk';

export const DanMeAPIMock = {
  getNodeList: jest.spyOn(DanMeAPI.prototype, 'getNodeList'),
};

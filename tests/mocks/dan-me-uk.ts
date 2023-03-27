import { DanMeAPI } from '@providers/implementations/dan-me-uk';

export const DanMeAPIMock = {
  getNodeList: jest.spyOn(DanMeAPI.prototype, 'getNodeList'),
};

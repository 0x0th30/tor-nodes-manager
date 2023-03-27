import { OnionooAPI } from '@3rd-party/onionoo';

export const OnionooAPIMock = {
  getNodeList: jest.spyOn(OnionooAPI.prototype, 'getNodeList'),
};

import { OnionooAPI } from '@providers/onionoo';

export const OnionooAPIMock = {
  getNodeList: jest.spyOn(OnionooAPI.prototype, 'getNodeList'),
};

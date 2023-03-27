import { OnionooAPI } from '@providers/implementations/onionoo';

export const OnionooAPIMock = {
  getNodeList: jest.spyOn(OnionooAPI.prototype, 'getNodeList'),
};

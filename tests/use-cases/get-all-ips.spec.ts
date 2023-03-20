import path from 'path';
import { RedisClientType } from '@redis/client';
import { GetAllIps, GetAllIpsResponse } from '@use-cases/get-all-ips';
import { OnionooAPI } from '@3rd-party/onionoo';
import { DanMeAPI } from '@3rd-party/dan-me-uk';
import { GetAllIpsMock } from '@mocks/get-all-ips';
import { OnionooAPIMock } from '@mocks/onionoo';
import { DanMeAPIMock } from '@mocks/dan-me-uk';
import { RedisClientMock } from '@mocks/redis';
import { fsMock } from '@mocks/fs';
import { InvalidResponseFromSource, NoResponseFromSource } from '@errors/node-list-source-error';

const GetAllIpsSUT = new GetAllIps(
  OnionooAPIMock as unknown as OnionooAPI,
  DanMeAPIMock as unknown as DanMeAPI,
  RedisClientMock as unknown as RedisClientType,
);

describe('"GetAllIps" class', () => {
  describe('(public) "execute" method', () => {
    it('should call "this.getOnionooIps" private method', async () => {
      GetAllIpsMock.getOnionooIps.mockResolvedValue(undefined);
      GetAllIpsMock.getDanMeIps.mockResolvedValue(undefined);

      await GetAllIpsSUT.execute().then(() => {
        expect(GetAllIpsMock.getOnionooIps).toBeCalled();
      });
    });
    it('should call "this.getDanMeIps" private method', async () => {
      GetAllIpsMock.getOnionooIps.mockResolvedValue(undefined);
      GetAllIpsMock.getDanMeIps.mockResolvedValue(undefined);

      await GetAllIpsSUT.execute().then(() => {
        expect(GetAllIpsMock.getDanMeIps).toBeCalled();
      });
    });
    it('should merge "this.getOnionooIps" and "this.getDanMeIps" results', async () => {
      GetAllIpsMock.getOnionooIps.mockResolvedValue(['4.4.4.4', '8.8.8.8']);
      GetAllIpsMock.getDanMeIps.mockResolvedValue(['127.0.0.1', '192.168.0.1']);

      const response: GetAllIpsResponse = {
        success: true,
        data: {
          addresses: ['4.4.4.4', '8.8.8.8', '127.0.0.1', '192.168.0.1'],
          results: 4,
        },
      };

      await GetAllIpsSUT.execute().then((value) => {
        expect(value).toEqual(response);
      });
    });
    it('should stay working even if no results from sources', async () => {
      GetAllIpsMock.getOnionooIps.mockResolvedValue([]);
      GetAllIpsMock.getDanMeIps.mockResolvedValue([]);

      const response: GetAllIpsResponse = {
        success: true,
        data: { addresses: [], results: 0 },
      };

      await GetAllIpsSUT.execute().then((value) => {
        expect(value).toEqual(response);
      });
    });
  });
  describe('(private) "getOnionooIps" method', () => {
    it('should call "OnionooAPI.getNodeList" to obtain Onionoo IPs', async () => {
      GetAllIpsMock.getOnionooIps.mockRestore();
      OnionooAPIMock.getNodeList.mockResolvedValue(undefined as unknown as string[]);

      await (GetAllIpsSUT as any).getOnionooIps().then(() => {
        expect(OnionooAPIMock.getNodeList).toBeCalled();
      });
    });
  });
  describe('(private) "getDanMeIps" method', () => {
    it('should search first in Redis cache by "danMeIps" list range', async () => {
      GetAllIpsMock.getDanMeIps.mockRestore();
      GetAllIpsMock.searchByDanMeIpsInRedis.mockResolvedValue([]);
      DanMeAPIMock.getNodeList.mockResolvedValue(undefined as unknown as string[]);
      GetAllIpsMock.storeDanMeIpsInRedis.mockImplementation();

      await (GetAllIpsSUT as any).getDanMeIps().then(() => {
        expect(GetAllIpsMock.searchByDanMeIpsInRedis).toBeCalled();
        expect(DanMeAPIMock.getNodeList).toBeCalledTimes(0);
      });
    });
    it('should return Redis content, if it return something', async () => {
      GetAllIpsMock.getDanMeIps.mockRestore();
      GetAllIpsMock.searchByDanMeIpsInRedis.mockResolvedValue(['8.8.8.8']);

      const response = ['8.8.8.8'];

      await (GetAllIpsSUT as any).searchByDanMeIpsInRedis().then((value: string[]) => {
        expect(value).toEqual(response);
        expect(DanMeAPIMock.getNodeList).toBeCalledTimes(0);
      });
    });
    it('should request IPs to endpoint, if it not cached', async () => {
      GetAllIpsMock.getDanMeIps.mockRestore();
      GetAllIpsMock.searchByDanMeIpsInRedis.mockResolvedValue(undefined);
      DanMeAPIMock.getNodeList.mockResolvedValue(['8.8.8.8']);
      GetAllIpsMock.storeDanMeIpsInRedis.mockImplementation();
      fsMock.writeFileSync.mockImplementation();

      await (GetAllIpsSUT as any).getDanMeIps().then(() => {
        expect(DanMeAPIMock.getNodeList).toBeCalled();
      });
    });
    it('should cache endpoint returned IPs', async () => {
      GetAllIpsMock.getDanMeIps.mockRestore();
      GetAllIpsMock.searchByDanMeIpsInRedis.mockResolvedValue(undefined);
      DanMeAPIMock.getNodeList.mockResolvedValue(['8.8.8.8']);
      GetAllIpsMock.storeDanMeIpsInRedis.mockImplementation();
      fsMock.writeFileSync.mockImplementation();

      await (GetAllIpsSUT as any).getDanMeIps().then(() => {
        expect(GetAllIpsMock.storeDanMeIpsInRedis).toBeCalled();
      });
    });
    it('should return endpoint content, if it return something', async () => {
      GetAllIpsMock.getDanMeIps.mockRestore();
      GetAllIpsMock.searchByDanMeIpsInRedis.mockResolvedValue(undefined);
      DanMeAPIMock.getNodeList.mockResolvedValue(['8.8.8.8']);
      GetAllIpsMock.storeDanMeIpsInRedis.mockImplementation();
      fsMock.writeFileSync.mockImplementation();

      const response = ['8.8.8.8'];

      await (GetAllIpsSUT as any).getDanMeIps().then((value: string[]) => {
        expect(value).toEqual(response);
      });
    });
    it('should rewrite local stored JSON file with the returned IPs', async () => {
      GetAllIpsMock.getDanMeIps.mockRestore();
      GetAllIpsMock.searchByDanMeIpsInRedis.mockResolvedValue(undefined);
      DanMeAPIMock.getNodeList.mockResolvedValue(['8.8.8.8']);
      GetAllIpsMock.storeDanMeIpsInRedis.mockImplementation();
      fsMock.writeFileSync.mockImplementation();

      const pathToWrite = path
        .join(__dirname, '..', '..', 'src/utils/backup-dan-me-ips.json');
      const contentToWrite = JSON.stringify({ ips: ['8.8.8.8'] });

      await (GetAllIpsSUT as any).getDanMeIps().then(() => {
        expect(fsMock.writeFileSync).toBeCalled();
        expect(fsMock.writeFileSync).toBeCalledWith(pathToWrite, contentToWrite);
      });
    });
    it('should search in local stored JSON file, if API communication fail', async () => {
      GetAllIpsMock.getDanMeIps.mockRestore();
      GetAllIpsMock.searchByDanMeIpsInRedis.mockResolvedValue(undefined);
      DanMeAPIMock.getNodeList.mockImplementation(() => {
        throw new NoResponseFromSource('http://<fake-address>', 'ERROR_CODE');
      });
      GetAllIpsMock.storeDanMeIpsInRedis.mockImplementation();
      fsMock.writeFileSync.mockImplementation();

      await (GetAllIpsSUT as any).getDanMeIps().then().catch(() => {
        expect(DanMeAPIMock.getNodeList).toThrowError();
        expect(fsMock.readFileSync).toBeCalled();
      });
    });
    // this test will be refactored in the future
    // it('should return local store JSON file IPs, if found something', async () => {
    //   GetAllIpsMock.getDanMeIps.mockRestore();
    //   GetAllIpsMock.searchByDanMeIpsInRedis.mockResolvedValue(undefined);
    //   DanMeAPIMock.getNodeList.mockImplementation(() => {
    //     throw new NoResponseFromSource('http://<fake-address>', 'ERROR_CODE');
    //   });
    //   GetAllIpsMock.storeDanMeIpsInRedis.mockImplementation();
    //   fsMock.writeFileSync.mockImplementation();
    //   fsMock.readFileSync.mockReturnValue(JSON.stringify({ ips: ['8.8.8.8'] }));

    //   const response = ['8.8.8.8'];

    //   await (GetAllIpsSUT as any).getDanMeIps().then((value: string[]) => {
    //     expect(value).toEqual(response);
    //   });
    // });
  });
  describe('(private) "searchByDanMeIpsInRedis" method', () => {
    it('should search by IPs inside "danMeIps" list range', async () => {
      GetAllIpsMock.searchByDanMeIpsInRedis.mockRestore();
      RedisClientMock.lRange.mockResolvedValue([]);

      await (GetAllIpsSUT as any).searchByDanMeIpsInRedis().then(() => {
        expect(RedisClientMock.lRange).toBeCalled();
        expect(RedisClientMock.lRange).toBeCalledWith('danMeIps', 0, -1); // list indexes
      });
    });
    it('should return undefined if no one IP be found in cache', async () => {
      GetAllIpsMock.searchByDanMeIpsInRedis.mockRestore();
      RedisClientMock.lRange.mockResolvedValue([]);

      await (GetAllIpsSUT as any).searchByDanMeIpsInRedis()
        .then((value: string[] | undefined) => {
          expect(value).toEqual(undefined);
        });
    });
    it('should return a string list with IPs, if found something', async () => {
      GetAllIpsMock.searchByDanMeIpsInRedis.mockRestore();
      RedisClientMock.lRange.mockResolvedValue(['8.8.8.8']);

      await (GetAllIpsSUT as any).searchByDanMeIpsInRedis()
        .then((value: string[] | undefined) => {
          expect(value).toEqual(['8.8.8.8']);
        });
    });
  });
  describe('(private) "storeDanMeIpsInRedis" method', () => {
    it('should push IPs inside "danMeIps" list range', async () => {
      GetAllIpsMock.storeDanMeIpsInRedis.mockRestore();
      RedisClientMock.rPush.mockImplementation();
      RedisClientMock.expire.mockImplementation();

      const ipsToStore = ['8.8.8.8'];

      await (GetAllIpsSUT as any).storeDanMeIpsInRedis(ipsToStore).then(() => {
        expect(RedisClientMock.rPush).toBeCalled();
        expect(RedisClientMock.rPush).toBeCalledWith('danMeIps', ipsToStore);
      });
    });
    it('should update "danMeIps" list range TTL to 30 minutes/1800 seconds', async () => {
      GetAllIpsMock.storeDanMeIpsInRedis.mockRestore();
      RedisClientMock.rPush.mockImplementation();
      RedisClientMock.expire.mockImplementation();

      const ipsToStore = ['8.8.8.8'];
      const danMeIpsTTLInSeconds = 1800;

      await (GetAllIpsSUT as any).storeDanMeIpsInRedis(ipsToStore).then(() => {
        expect(RedisClientMock.expire).toBeCalled();
        expect(RedisClientMock.expire).toBeCalledWith('danMeIps', danMeIpsTTLInSeconds);
      });
    });
  });
  describe('(private) "generateSecureErrorMessage" method', () => {
    it('should return message according throwed error', async () => {
      GetAllIpsMock.generateSecureErrorMessage.mockRestore();

      let error;
      let expectedMessage: string;
      let generatedMessage: string;

      error = new InvalidResponseFromSource('<url>', 500);
      expectedMessage = '"<url>" sent status 500, try again later!';
      generatedMessage = (GetAllIpsSUT as any).generateSecureErrorMessage(error);
      expect(generatedMessage).toEqual(expectedMessage);

      error = new NoResponseFromSource('<url>', '<code>');
      expectedMessage = '"<url>" sent <code>, please report this issue!';
      generatedMessage = (GetAllIpsSUT as any).generateSecureErrorMessage(error);
      expect(generatedMessage).toEqual(expectedMessage);

      error = new Error('foo bar');
      expectedMessage = 'An internal/unknown error was throwed, please report'
        + ' this issue!';
      generatedMessage = (GetAllIpsSUT as any).generateSecureErrorMessage(error);
      expect(generatedMessage).toEqual(expectedMessage);
    });
  });
});

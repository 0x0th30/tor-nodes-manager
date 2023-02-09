import axios from 'axios';
import * as axiosErrorCodes from '@utils/axios-error-codes';
import { NodeListSource } from '@contracts/node-list-source';
import { UnexpectedResponse, UnavailableSource } from '@errors/node-list-source';
import { RequestFail } from '@errors/application';
import { logger } from '@loaders/logger';

class OnionooAPI implements NodeListSource {
  private address: string;

  constructor() {
    this.address = 'https://onionooa.torproject.org/summary?limit=5000';
  }

  public async getNodeList(): Promise<string[]> {
    logger.info('Starting to get node list from Onionoo API...');
    const nodeList: string[] = [];

    logger.info(`Requesting to "${this.address}"...`);
    await axios.get(this.address)
      .then((response: any) => {
        logger.info('Filtering response...');

        const rawNodeList: object[] = response.data.relays;
        rawNodeList.forEach((register: any) => {
          const nodeIP: string = register.a[0];
          nodeList.push(nodeIP);
        });
      })
      .catch((error: any) => {
        if (error.response) {
          const { status, statusText } = error.response;

          logger.error(`Received status code ${status}.`);
          throw new UnexpectedResponse(status, statusText);
        } else if (error.request) {
          const { code } = error;

          logger.error(`Not received response. Details: ${code} ${error}`);
          if (axiosErrorCodes.UNAVAILABLE.includes(code)) {
            throw new UnavailableSource(this.address);
          }
        } else {
          logger.error(`Request wasn't performed. Details: ${error}`);
          throw new RequestFail();
        }
      });

    logger.info('Returning node list...');
    return nodeList;
  }
}

export { OnionooAPI };

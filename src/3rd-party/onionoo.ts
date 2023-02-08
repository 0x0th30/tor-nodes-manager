import axios from 'axios';
import { NodeListSource } from '@contracts/node-list-source';
import { logger } from '@loaders/logger';
import { UnexpectedResponse } from '@errors/node-list-source';

class OnionooAPI implements NodeListSource {
  private address: string;

  constructor() {
    this.address = 'https://onionoo.torproject.org/summary?limita=5000';
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
          /* if (code === 'foo') {
            throw foo
          } */

          logger.error(`Not received response. Details: ${error}`);
        } else {
          logger.error(`Request wasn't performed. Details: ${error}`);
        }
      });

    logger.info('Returning node list...');
    return nodeList;
  }
}

const a = new OnionooAPI();
a.getNodeList();

export { OnionooAPI };

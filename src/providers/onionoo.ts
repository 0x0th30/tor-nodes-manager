import axios from 'axios';
import { NodeListProvider } from '@contracts/node-list-provider';
import { logger } from '@loaders/logger';
import { InvalidResponseFromSource, NoResponseFromSource }
  from '@errors/node-list-source-error';

class OnionooAPI implements NodeListProvider {
  private address: string;

  constructor() {
    this.address = 'https://onionoo.torproject.org/summary?limit=5000';
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
          logger.error(`Received status code ${error.response.status}.`);
          throw new InvalidResponseFromSource(this.address, error.response.status);
        } else if (error.request) {
          logger.error(`Not received response. Details: ${error.code}`);
          throw new NoResponseFromSource(this.address, error.code);
        } else {
          logger.error(`Request wasn't performed. Details: ${error}`);
          throw error;
        }
      });

    logger.info('Returning node list...');
    return nodeList;
  }
}

export { OnionooAPI };

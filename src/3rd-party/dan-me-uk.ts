import axios from 'axios';
import { NodeListSource } from '@contracts/node-list-source';
import { logger } from '@loaders/logger';
import { InvalidResponseFromSource, NoResponseFromSource }
  from '@errors/node-list-source-error';

class DanMeAPI implements NodeListSource {
  private address: string;

  constructor() {
    this.address = 'https://www.dan.me.uk/torlist/';
  }

  public async getNodeList(): Promise<string[]> {
    logger.info('Starting to get node list from Dan Me API...');
    const nodeList: string[] = [];

    logger.info(`Requesting to "${this.address}"...`);
    await axios.get(this.address)
      .then((response) => {
        logger.info('Filtering response...');

        const rawResponse: string = response.data;
        const rawNodeList: string[] = rawResponse.split('\n');
        rawNodeList.forEach((register) => {
          nodeList.push(register);
        });
      })
      .catch((error) => {
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

export { DanMeAPI };

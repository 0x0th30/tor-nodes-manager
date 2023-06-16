import axios, { AxiosError } from 'axios';
import { logger } from '@utils/logger';

export class DanMeAPI {
  private readonly axios;

  constructor() {
    const baseURL = 'https://www.dan.me.uk';
    this.axios = axios.create({ baseURL });
  }

  public async getNodeList(): Promise<Array<string>> {
    const nodeList: Array<string> = [];

    const path = '/torlist';
    await this.axios.get(path)
      .then((response) => {
        logger.info('Filtering response...');

        const rawResponse = response.data;
        const rawNodeList = rawResponse.split('\n');
        rawNodeList.forEach((nodeIP: string) => {
          nodeList.push(nodeIP);
        });
      })
      .catch((error) => {
        if (error.response) {
          logger.error(`Received status code ${error.response.status}.`);
          throw error;
        } else if (error.request) {
          logger.error(`Not received response. Details: ${error.code}`);
          throw error;
        } else if (error instanceof AxiosError) {
          logger.error(`Request wasn't performed. Details: ${error}`);
          throw error;
        } else {
          logger.error(`Failed by unknown reasons. Details: ${error}`);
          throw error;
        }
      });

    logger.info('Returning node list...');
    return nodeList;
  }
}

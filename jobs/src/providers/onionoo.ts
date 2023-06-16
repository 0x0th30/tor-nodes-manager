import axios, { AxiosError } from 'axios';
import { logger } from '@utils/logger';

export class OnionooAPI {
  private readonly axios;

  constructor() {
    const baseURL = 'https://onionoo.torproject.org';
    this.axios = axios.create({ baseURL });
  }

  public async getNodeList() {
    console.log('Starting to get node list from Onionoo API...');
    const nodeList: Array<string> = [];

    const path = '/summary?limit=5000';
    await this.axios.get(path)
      .then((response) => {
        logger.info('Filtering response...');

        const rawNodeList = response.data.relays;
        rawNodeList.forEach((register: any) => {
          const nodeIP = register.a[0] as string;
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

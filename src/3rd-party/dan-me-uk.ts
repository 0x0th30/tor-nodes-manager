import axios from 'axios';
import { NodeListSource } from '@contracts/node-list-source';
import { logger } from '@loaders/logger';

class DanMeAPI implements NodeListSource {
  private address: string;

  constructor() {
    this.address = 'https://www.dan.me.uk/torlist/';
  }

  public getNodeList(): Promise<string> {}
}

export { DanMeAPI };

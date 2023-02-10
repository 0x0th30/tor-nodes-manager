import axios from 'axios';
import { NodeListSource } from '@contracts/node-list-source';
// import { logger } from '@loaders/logger';

class DanMeAPI implements NodeListSource {
  private address: string;

  constructor() {
    this.address = 'https://www.dan.me.uk/torlist/';
  }

  public async getNodeList(): Promise<string[]> {
    const nodeList: string[] = [];

    await axios.get(this.address)
      .then((response) => {
        console.log(typeof response.data);
      })
      .catch((error) => {
        console.log(error);
      });

    return nodeList;
  }
}

export { DanMeAPI };

const a = new DanMeAPI();
a.getNodeList();

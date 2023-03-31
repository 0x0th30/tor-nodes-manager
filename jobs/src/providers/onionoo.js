const axios = require('axios');

class OnionooAPI {
  constructor() {
    this.address = 'https://onionoo.torproject.org/summary?limit=5000';
  }

  async getNodeList() {
    console.log('Starting to get node list from Onionoo API...');
    const nodeList = [];

    console.log(`Requesting to "${this.address}"...`);
    await axios.get(this.address)
      .then((response) => {
        console.log('Filtering response...');

        const rawNodeList = response.data.relays;
        rawNodeList.forEach((register) => {
          const nodeIP = register.a[0];
          nodeList.push(nodeIP);
        });
      })
      .catch((error) => {
        if (error.response) {
          console.log(`Received status code ${error.response.status}.`);
          throw error;
        } else if (error.request) {
          console.log(`Not received response. Details: ${error.code}`);
          throw error;
        } else {
          console.log(`Request wasn't performed. Details: ${error}`);
          throw error;
        }
      });

    console.log('Returning node list...');
    return nodeList;
  }
}

module.exports = new OnionooAPI();

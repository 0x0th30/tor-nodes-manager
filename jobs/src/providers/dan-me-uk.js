const axios = require('axios');

class DanMeAPI {
  constructor() {
    this.address = 'https://www.dan.me.uk/torlist/';
  }

  async getNodeList() {
    console.log('Starting to get node list from Dan Me API...');
    const nodeList = [];

    console.log(`Requesting to "${this.address}"...`);
    await axios.get(this.address)
      .then((response) => {
        console.log('Filtering response...');

        const rawResponse = response.data;
        const rawNodeList = rawResponse.split('\n');
        rawNodeList.forEach((register) => {
          nodeList.push(register);
        });
      })
      .catch((error) => {
        if (error.response) {
          console.log(`Received status code ${error.response.status}.`);
          // throw error;
          console.log(error);
        } else if (error.request) {
          console.log(`Not received response. Details: ${error.code}`);
          // throw error;
          console.log(error);
        } else {
          console.log(`Request wasn't performed. Details: ${error}`);
          // throw error;
          console.log(error);
        }
      });

    console.log('Returning node list...');
    return nodeList;
  }
}

module.exports = new DanMeAPI();

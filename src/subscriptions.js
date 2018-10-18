const axios = require('axios');
const { orionIP, localIP, port } = require('../constants');

async function deleteSubscriptions() {
  const response = await axios.get(`http://${orionIP}:1026/v2/subscriptions`);

  response.data.forEach(async (subscription) => {
    await axios.delete(`http://${orionIP}:1026/v2/subscriptions/${subscription.id}`);
  });
}

function subscribe() {
  return axios.post(`http://${orionIP}:1026/v2/subscriptions`, {
    description: 'Get info about all the buses',
    subject: {
      entities: [
        {
          idPattern: '.*',
          type: 'Bus'
        }
      ]
    },
    notification: {
      http: {
        url: `http://${localIP}:${port}/callback`
      }
    },
    expires: '2040-01-01T14:00:00.00Z',
  })
}

module.exports = {
  deleteSubscriptions,
  subscribe,
}

const app = require('./src/server');
const { orionIP, localIP, port } = require('./constants');
const graphFactory = require('./src/graphFactory');
const { deleteSubscriptions, subscribe } = require('./src/subscriptions');
const axios = require('axios');

axios.get(`http://${orionIP}/api/trayectosporlinea`).then(({ data }) => {
  graphFactory.initialize(data);
  
  console.log(`Graph loaded with ${graphFactory.countStops()} stops`);

  deleteSubscriptions().then(async () => {
    console.log(`Asking Orion (at ${orionIP}) to subscribe me...`)
    await subscribe();
    console.log('Done!');
  });
  
  app.listen(port, () => console.log(`Listening at ${localIP}:${port}`));
});
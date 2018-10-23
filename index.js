const app = require('./src/server');
const { orionIP, port } = require('./constants');
const graphFactory = require('./src/graphFactory');
const { deleteSubscriptions, subscribe } = require('./src/subscriptions');
const axios = require('axios');

axios.get(`http://${orionIP}/api/trayectosporlinea`).then(({ data }) => {
  graphFactory.initialize(data);
  
  console.log(`Graph loaded with ${graphFactory.countStops()} stops`);

  deleteSubscriptions().then(async () => {
    await subscribe();
  });
  
  app.listen(port, () => console.log(`listening at ${port}`));  
});
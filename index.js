const app = require('./src/server');
const { orionIP, port } = require('./constants');
const stopsFactory = require('./src/stopsFactory');
const { deleteSubscriptions, subscribe } = require('./src/subscriptions');
const axios = require('axios');

axios.get(`http://${orionIP}/api/trayectosporlinea`).then(({ data }) => {
  stopsFactory.load(data);
  
  console.log(`Graph loaded with ${Object.keys(stopsFactory.getStops()).length} stops`);

  deleteSubscriptions().then(async () => {
    await subscribe();
  });
  
  app.listen(port, () => console.log(`listening at ${port}`));  
});
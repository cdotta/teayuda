const app = require('./src/server');
const { port } = require('./constants');
const { deleteSubscriptions, subscribe } = require('./src/subscriptions');

deleteSubscriptions().then(async () => {
  // await subscribe();
});

app.listen(port, () => console.log(`listening at ${port}`));

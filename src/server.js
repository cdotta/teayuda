const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

app.get('/', (req, res) => res.send({ name: 'Hello World!' }));

app.post('/callback', (req, res) => {
  console.log(req.body);
  res.send({ status: 'OK' })
});

module.exports = app;

const express = require('express');
const app = express();
const Bus = require('./bus');
const bodyParser = require('body-parser');
const graphFactory = require('./graphFactory');

app.use(bodyParser.json());

app.get('/', (req, res) => res.send({ name: 'Hello World!' }));

app.get('/nextBus/:idLinea/:idParada', (req, res) => {
  const result = graphFactory.calculateETA({lineId: req.params.idLinea, stopId: req.params.idParada});
  if (result.tea === -1) {
    res.send({});
  } else {
    res.send(result);
  }
});

app.post('/callback', (req, res) => {
  req.body.data.forEach( graphFactory.update );
  res.send({ status: 'OK' })
});

module.exports = app;

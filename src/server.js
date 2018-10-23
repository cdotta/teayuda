const express = require('express');
const app = express();
const Bus = require('./bus');
const bodyParser = require('body-parser');
const graphFactory = require('./graphFactory');

app.use(bodyParser.json());

app.get('/', (req, res) => res.send({ name: 'Hello World!' }));

app.get('/nextBus/:idLinea/:idParada', (req, res) => {
  res.send( graphFactory.calculateETA({lineId: req.params.idLinea, stopId: req.params.idParada}) );
});

app.post('/callback', (req, res) => {
  req.body.data.forEach( graphFactory.update );
  res.send({ status: 'OK' })
});

module.exports = app;

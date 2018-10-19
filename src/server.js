const express = require('express');
const app = express();
const observer = require('./observer').init({some_config_parameter: 12});
const bodyParser = require('body-parser');

app.use(bodyParser.json());

app.get('/', (req, res) => res.send({ name: 'Hello World!' }));

app.get('/nextBus/:idLinea/:idParada', (req, res) => {
  res.send({
    id_linea: req.params.idLinea,
    id_parada: req.params.idParada,
    id_bus: 314,
    location: {
      type: 'Point',
      coordinates: [-59.19539, -34.90608],
    },
    tea: 150,
  });
});

app.post('/callback', (req, res) => {
  observer.update(req.body.data[0]).then(async () => {
    // do something when bus update is successful
  });
  res.send({ status: 'OK' })
});

module.exports = app;

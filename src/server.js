const express = require('express');
const app = express();
const Bus = require('./bus');
const bodyParser = require('body-parser');

const buses = {};

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
  req.body.data.forEach(({id, linea, location, timestamp}) => {
    const params = {
      id: id,
      line: linea.value,
      x: location.value.coordinates[0],
      y: location.value.coordinates[1],
      timestamp: timestamp.value,
    };
    if (buses[id]) {
      buses[id].update(params);
    } else {
      buses[id] = new Bus(params);
      buses[id].on('bus:update', (event) => {
        console.log(event);
      })
    }
  });
  res.send({ status: 'OK' })
});

module.exports = app;

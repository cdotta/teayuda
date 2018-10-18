const express = require('express');
const app = express();
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
  console.log(req.body);
  res.send({ status: 'OK' })
});

module.exports = app;

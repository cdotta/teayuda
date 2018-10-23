const Bus = require('./bus');
const Stop = require('./stop');

const stops = {};
const lines = {};
const buses = {};

// This function loads path information in the form:
//   "trayectos": [
//     {
//       "codigoParada": "4836",
//       "linea": "217",
//       "ordinal": "1",
//       "calle": "AV DRA MA L SALDUN DE RODRIGUEZ",
//       "esquina": "AV BOLIVIA",
//       "long": "-56.0833009323971",
//       "lat": "-34.8818168390103"
//     }, ... ]
// and creates the internal structures needed by the system
// to quickly access stops, by stop id, and sorted arrays
// of stops defining a path, by line id.
function initialize({trayectos}) {
    for (var i = 0; i < trayectos.length - 1; i++) {
        if (!trayectos[i+1] || !trayectos[i+1].codigoParada) {
            continue;
        }
        var datum = trayectos[i];
        var nextDatum = trayectos[i+1];
        const stop = stops[datum.codigoParada] || new Stop({id: datum.codigoParada, long: datum.long, lat: datum.lat});
        const nextStop = stops[nextDatum.codigoParada] || new Stop({id: nextDatum.codigoParada, long: datum.long, lat: datum.lat});
        if (nextDatum.linea === datum.linea) {
            nextStop.addFrom(stop, datum.linea);
        }
        stops[stop.id] = stop;
        stops[nextStop.id] = nextStop;

        if (i === 0) {
            lines[datum.linea] = [ stop ];
        }
        if (lines[nextDatum.linea]) {
            lines[nextDatum.linea].push(nextStop);
        } else {
            lines[nextDatum.linea] = [ nextStop ];
        }
    }
}

// This function updates a bus given params structured as:
// {id, line, long, lat, timestamp}
function updateBus(params) {
    if (buses[params.id]) {
        buses[params.id].update(params);
    } else {
        buses[params.id] = new Bus(params);
    }
}

// This function reassigns a bus to a new stop if they are close enough.
function reassignStop(bus) {
    const line = lines[bus.line];
    if (!line) {
        console.log(`There is no information about the line ${bus.line}`)
        return;
    };

    if (!bus.stop) {
        for (var i = 0; i < line.length; i++) {
            const stop = line[i];
            if (bus.near(stop)) {
                stop.addBus(bus, null);
                break;
            }
        }
    } else {
        const stopIndex = line.indexOf(bus.stop);
        for (var i = stopIndex + 1; i < line.length; i++) {
            const stop = line[i];
            if (bus.near(stop)) {
                stop.addBus(bus, bus.stop);
                break;
            }
        }
    }
}

function update({id, linea, location, timestamp}) {
    updateBus({
        id: id,
        line: linea.value,
        long: location.value.coordinates[0],
        lat: location.value.coordinates[1],
        timestamp: timestamp.value,
    });

    reassignStop(buses[id]);
}

function countStops() {
    return Object.keys(stops).length;
}

module.exports = {
    initialize,
    update,
    countStops,
}
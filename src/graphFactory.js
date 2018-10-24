const util = require('util');

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

function countStops() {
    return Object.keys(stops).length;
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
        console.log(`There is no information about line ${bus.line}`)
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
        // It always searches the next stops starting from the current stop.
        for (var i = stopIndex + 1; i < line.length; i++) {
            const stop = line[i];
            if (bus.near(stop)) {
                stop.addBus(bus, bus.stop);
                break;
            }
        }
    }
}

// This function updates information about the buses' locations
// and reassigns them to new stops as they move
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

function _calculateTimeFromBusToNextStop( bus, nextStop ) {
    // Implement NASA's function
    return 50;
}

function _calculateETA({ lineId, stop }) {
    if (!stop) {
        console.log(`Didn't find bus for line ${lineId}`);
        return { tea: -1 };
    }

    console.log(`_calculateETA({${lineId}, ${stop.id}})`);

    const bus = stop.buses.find( (bus) => {
        return bus.line === lineId;
    });

    if (bus) {
        console.log(`Bus ${bus.id} found at stop ${stop.id}`);
        // filter out the bus if timestamp is too old
        return {
            id_linea: lineId,
            id_parada: stop.id,
            id_bus: bus.id,
            location: {
                type: "Point",
                coordinates: [bus.long, bus.lat],
            },
            tea: _calculateTimeFromBusToNextStop( bus, stop ),
        }
    } else {
        const prevStop = stop.findPrevStopByLineId(lineId);
        const result = _calculateETA( { lineId: lineId, stop: prevStop } );
        console.log(util.inspect(result, {color: true}));
        if (result.tea !== -1) {
            result.tea += stop.getTimeFromPrevStop(prevStop);
        }
        return result;
    }
}

function calculateETA({ lineId, stopId }) {
    const stop = stops[stopId];

    if (!lines[lineId]) return { error: "Line not found" };
    if (!stop) return { error: "Bus stop not found"};

    const bus = stop.buses.find( (bus) => {
        return bus.line === lineId;
    });

    if (bus) {
        console.log(`Bus ${bus.id} just left the stop! (stopId = ${stopId})`);

        return {
            id_linea: lineId,
            id_parada: stop.id,
            id_bus: bus.id,
            location: {
                type: "Point",
                coordinates: [bus.long, bus.lat],
            },
            tea: 0,
        }
    }
    
    return _calculateETA( { lineId: lineId, stop: stop } );
}

module.exports = {
    initialize,
    update,
    countStops,
    calculateETA,
}
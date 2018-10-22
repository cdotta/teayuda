const Bus = require('./bus');
const stopsFactory = require('./stopsFactory');

const buses = {};

function refreshBus(params) {
    if (buses[params.id]) {
        buses[params.id].update(params);
    } else {
        buses[params.id] = new Bus(params);
    }
}

function refreshStops(bus) {
    const line = stopsFactory.getLines()[bus.line];
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

function onBusUpdate({id, linea, location, timestamp}) {
    refreshBus({
        id: id,
        line: linea.value,
        long: location.value.coordinates[0],
        lat: location.value.coordinates[1],
        timestamp: timestamp.value,
    });

    refreshStops(buses[id]);
}

module.exports = {
    onBusUpdate,
}

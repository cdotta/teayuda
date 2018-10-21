const Stop = require('./stop');

var stops = null;
var lines = null;

function load({trayectos}) {
    stops = {};
    lines = {};

    for (var i = 0; i < trayectos.length - 1; i++) {
        if (!trayectos[i+1] || !trayectos[i+1].codigoParada) {
            continue;
        }
        var point = trayectos[i];
        var nextPoint = trayectos[i+1];
        const stop = stops[point.codigoParada] || new Stop({id: point.codigoParada, long: point.long, lat: point.lat});
        const nextStop = stops[nextPoint.codigoParada] || new Stop({id: nextPoint.codigoParada, long: point.long, lat: point.lat});
        if (nextPoint.linea === point.linea) {
            nextStop.addFrom(stop, point.linea);
        }
        stops[stop.id] = stop;
        stops[nextStop.id] = nextStop;

        if (i === 0) {
            lines[point.linea] = [ stop ];
        }
        if (lines[nextPoint.linea]) {
            lines[nextPoint.linea].push(nextStop);
        } else {
            lines[nextPoint.linea] = [ nextStop ];
        }
    }
    
    return stops;
}

function getStops() {
    return stops;
}

function getLines() {
    return lines;
}

module.exports = {
    load,
    getStops,
    getLines,
}
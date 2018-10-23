const { nearStopRadius } = require('../constants');
const { distance } = require('./geodistance');

class Bus {
    constructor({id, line, long, lat, timestamp}) {
        this.id = id;
        this.line = line;
        this.long = long;
        this.lat = lat;
        this.timestamp = timestamp;
        this.stop = null;
        this.stopArrivalTime = null;
    }

    update({line, long, lat, timestamp}) {
        if (this.line !== line && this.stop) {
            this.stop.removeBus(this);
        }
        this.line = line;
        this.long = long;
        this.lat = lat;
        this.timestamp = timestamp;
    }

    near(stop) {
        return distance({ lat1: stop.lat, lon1: stop.long, lat2: this.lat, lon2: this.long}) < nearStopRadius;
    }

    toString() {
        return `{id: ${this.id}, line: ${this.line}}`;
    }
}

module.exports = Bus;


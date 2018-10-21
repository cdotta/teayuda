const { nearStopRadius } = require('../constants');
const { distance } = require('./geodistance');

class Bus {
    constructor({id, line, long, lat, timestamp}) {
        this.id = id;
        this.line = line;
        this.long = long;
        this.lat = lat;
        this.timestamp = timestamp;
        this._stop = null;
    }

    update({line, long, lat, timestamp}) {
        if (this.line !== line) {
            this._stop = null;
            // console.log(`Bus ${this.id} line changed from ${this.line} to ${line}`);
        }
        this.line = line;
        this.long = long;
        this.lat = lat;
        this.timestamp = timestamp;
    }

    set stop(value) {
        if (this.id !== 241) { console.log(`Bus ${this.id} stop changed from ${this._stop ? this._stop.id : null} to ${value.id}`) };
        this._stop = value;
    }

    get stop() {
        return this._stop;
    }

    near(stop) {
        return distance({ lat1: stop.lat, lon1: stop.long, lat2: this.lat, lon2: this.long}) < nearStopRadius;
    }
}

module.exports = Bus;
const { nearStopRadius } = require('../constants');
const { distance } = require('./geodistance');

class Bus {
    constructor({id, line, long, lat, timestamp}) {
        this.id = id;
        this.line = line;
        this.long = long;
        this.lat = lat;
        this.timestamp = new Date(timestamp).getTime() / 1000;
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
        this.timestamp = new Date(timestamp).getTime() / 1000;
    }

    near(stop) {
        return distance({lat1: stop.lat, lon1: stop.long, lat2: this.lat, lon2: this.long}) < nearStopRadius;
    }

    progress(nextStop) {
        if (!this.stop) {
            return -1;
        }

        const od = distance({lat1: this.stop.lat, lon1: this.stop.long, lat2: nextStop.lat, lon2: nextStop.long});

        if (od === 0) return 1.0; // Edge case when O and D are the same.

        const ox = distance({lat1: this.stop.lat, lon1: this.stop.long, lat2: this.lat, lon2: this.long});
        const xd = distance({lat1: this.lat, lon1: this.long, lat2: nextStop.lat, lon2: nextStop.long});
        const s  = (ox + xd + od) / 2;
        const hx = (2 / od) * Math.sqrt(s * (s - ox) * (s - xd) * (s - od));

        let beta = Math.sqrt(Math.pow(xd, 2) - Math.pow(hx, 2)) / od;

        // console.log(`O = [${this.stop.lat}, ${this.stop.long}], X = [${this.lat}, ${this.long}], D = [${nextStop.lat}, ${nextStop.long}]`);
        // console.log(`od: ${od}, ox: ${ox}, xd: ${xd}, s: ${s}, hx: ${hx}, beta: ${beta}`);

        beta = beta < 0.0 ? 0.0 : beta;
        beta = beta > 1.0 ? 1.0 : beta;

        return beta;
    }

    toString() {
        return `{id: ${this.id}, line: ${this.line}}`;
    }
}

module.exports = Bus;


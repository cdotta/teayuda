const { ExpFilter } = require('./filter');
const { maxBusTimeBetweenStops, minBusTimeBetweenStops } = require('../constants');

class Link {
    constructor(fromStop, line) {
        this.lines = [line];
        this.fromStop = fromStop;
        this.filter = new ExpFilter();
    }

    addLine(line) {
        this.lines.push(line);
    }

    updateTime(time) {
        this.filter.update(time);
    }

    getEstimatedTime() {
        return this.filter.getEstimation();
    }
}

class Stop {
    constructor({id, long, lat}) {
        this.id = id;
        this.long = long;
        this.lat = lat;
        this.links = {};
        this.buses = [];
    }

    addFrom(fromStop, line) {
        if (this.links[fromStop.id]) {
            this.links[fromStop.id].addLine(line);
        } else {
            this.links[fromStop.id] = new Link(fromStop, line);
        }
    }

    addBus(bus, fromStop) {
        if (fromStop) {
            console.log("\x1b[36m", `Bus ${bus} moved from ${fromStop} to ${this}`, "\x1b[0m");
            fromStop.removeBus(bus);

            if (this.links[fromStop.id]) { // This means that the bus comes from the previous stop.
                const deltaTime = bus.timestamp - bus.stopArrivalTime;
                if (deltaTime <= maxBusTimeBetweenStops && deltaTime >= minBusTimeBetweenStops) {
                    this.links[fromStop.id].updateTime(deltaTime);
                }
            }
        }
        bus.stop = this;
        bus.stopArrivalTime = bus.timestamp;
        this.buses.push(bus);
    }

    removeBus(bus) {
        this.buses = this.buses.filter(({ id }) => id !== bus.id);
        bus.stop = null;
    }

    _findLinkToPrevStopByLineId(lineId) {
        return Object.values(this.links).find( (link) => {
            return link.lines.indexOf(lineId) !== -1;
        });
    }

    findPrevStopByLineId(lineId) {
        const link = this._findLinkToPrevStopByLineId(lineId);
        return link && link.fromStop;
    }

    getTimeFromPrevStop(prevStop) {
        return this.links[prevStop.id] ? this.links[prevStop.id].getEstimatedTime() : -1;
    }

    toString() {
        return this.id;
    }
}

module.exports = Stop;

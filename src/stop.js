class Link {
    constructor(fromStop, line) {
        this.lines = [line];
        this.fromStop = fromStop;
    }

    addLine(line) {
        this.lines.push(line);
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
            console.log(`Bus ${bus} moved from ${fromStop} to ${this}`);
            fromStop.removeBus(bus);
        }
        bus.stop = this;
        this.buses.push(bus);
    }

    removeBus(bus) {
        this.buses = this.buses.filter(({ id }) => id !== bus.id);
        bus.stop = null;
    }

    toString() {
        return this.id;
    }
}

module.exports = Stop;

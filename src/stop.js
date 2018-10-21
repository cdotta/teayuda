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
    }

    addFrom(fromStop, line) {
        if (this.links[fromStop.id]) {
            this.links[fromStop.id].addLine(line);
        } else {
            this.links[fromStop.id] = new Link(fromStop, line);
        }
    }
}

module.exports = Stop;
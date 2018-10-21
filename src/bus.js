const EventEmitter = require('events');

class Bus extends EventEmitter {
    constructor({id, line, x, y, timestamp}) {
        super();
        this.id = id;
        this.line = line;
        this.x = x;
        this.y = y;
        this.timestamp = timestamp;
    }

    update({x, y, timestamp}) {
        this.x = x;
        this.y = y;
        this.timestamp = timestamp;
        this.emit("bus:update", {id: this.id, line: this.line, x: this.x, y: this.y, timestamp: this.timestamp});        
    }
}

module.exports = Bus;
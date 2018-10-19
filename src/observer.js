function init(config) {
    this.config = config;
    return this;
}

async function update(bus) {
    console.log(bus);
}

module.exports = {
    init,
    update,
}
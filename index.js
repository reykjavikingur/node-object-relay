class Repeater {

    constructor(target) {
        this.proxy = new Proxy(target, {
            // TODO include handlers
        });
        // TODO set transmitter
    }
}

module.exports = Repeater;

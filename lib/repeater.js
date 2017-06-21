class Repeater {

    constructor(target) {
        let receivers = new Set();
        let proxy = new Proxy(target, {
            set(target, property, value, altReceiver) {
                target[property] = value;
                for (let receiver of receivers) {
                    if (receiver.hasOwnProperty(property)) {
                        receiver[property] = value;
                    }
                }
                return true;
            }
        });
        let transmitter = {
            transmit(receiver) {
                receivers.add(receiver);
                for (let k in receiver) {
                    if (receiver.hasOwnProperty(k)) {
                        receiver[k] = proxy[k];
                    }
                }
                return {
                    close() {
                        receivers.delete(receiver);
                    }
                };
            }
        };

        this.proxy = proxy;
        this.transmitter = transmitter;
    }
}

module.exports = Repeater;

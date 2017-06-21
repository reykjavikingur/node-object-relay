const FunctionRepeater = require('./function-repeater');

class Repeater {

    constructor(target) {
        let receivers = new Set();

        let functionRepeaterMap = {};
        for (let k in target) {
            if (target.hasOwnProperty(k)) {
                if (typeof target[k] === 'function') {
                    functionRepeaterMap[k] = new FunctionRepeater(target[k]);
                }
            }
        }

        let proxy = new Proxy(target, {
            get(target, property) {
                if (typeof target[property] === 'function') {
                    return functionRepeaterMap[property].proxy;
                }
                return target[property];
            },
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
                let subtransmissions = [];
                for (let k in receiver) {
                    if (receiver.hasOwnProperty(k)) {
                        if (typeof receiver[k] === 'function') {
                            if (functionRepeaterMap.hasOwnProperty(k)) {
                                let subtransmission = functionRepeaterMap[k].transmitter.transmit(receiver[k]);
                                subtransmissions.push(subtransmission);
                            }
                        }
                        else {
                            receiver[k] = proxy[k];
                        }
                    }
                }
                return {
                    close() {
                        receivers.delete(receiver);
                        for (let subtransmission of subtransmissions) {
                            subtransmission.close();
                        }
                    }
                };
            }
        };

        this.proxy = proxy;
        this.transmitter = transmitter;

    }
}

module.exports = Repeater;

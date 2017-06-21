const FunctionRepeater = require('./function-repeater');

class Repeater {

    constructor(target) {
        let receivers = new Set();

        let functionRepeaterMap = {};
        for (let k in target) {
            if (target.hasOwnProperty(k)) {
                if (typeof target[k] === 'function') {
                    let fr = new FunctionRepeater(target[k]);
                    functionRepeaterMap[k] = fr;
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
                for (let k in receiver) {
                    if (receiver.hasOwnProperty(k)) {
                        if (typeof receiver[k] === 'function') {
                            if (functionRepeaterMap.hasOwnProperty(k)) {
                                functionRepeaterMap[k].transmitter.transmit(receiver[k]);
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
                    }
                };
            }
        };

        this.proxy = proxy;
        this.transmitter = transmitter;

    }
}

module.exports = Repeater;

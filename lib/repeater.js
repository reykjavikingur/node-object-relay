class Repeater {

    constructor(target) {
        let receivers = new Set();
        let proxy = new Proxy(target, {
            set: function (target, property, value, altReceiver) {
                target[property] = value;
                for (let receiver of receivers) {
                    if (receiver.hasOwnProperty(property)) {
                        try {
                            receiver[property] = value;
                        }
                        catch (e) {
                            console.error('unable to transmit', property, 'to', receiver);
                        }
                    }
                }
                return true;
            }
        });
        let transmitter = {
            transmit: function (receiver) {
                receivers.add(receiver);
                for (let k in receiver) {
                    if (receiver.hasOwnProperty(k)) {
                        receiver[k] = proxy[k];
                    }
                }
                return {
                    close: function () {
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

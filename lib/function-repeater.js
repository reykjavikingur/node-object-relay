class FunctionRepeater {

    constructor(target, targetContext) {
        let receivers = new Set();
        let proxy = new Proxy(target, {
            apply(target, proxyContext, args) {
                let rv = target.apply(targetContext || proxyContext, args);
                for (let receiver of receivers) {
                    receiver.apply(targetContext, args);
                }
                return rv;
            }
        });
        let transmitter = {
            transmit(receiver) {
                receivers.add(receiver);
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

module.exports = FunctionRepeater;

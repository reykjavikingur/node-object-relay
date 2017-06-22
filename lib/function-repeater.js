class FunctionRepeater {

    constructor(target, targetContext) {
        let receivers = new Set();
        let proxy = new Proxy(target, {
            apply(target, proxyContext, args) {
                let rv = target.apply(targetContext || proxyContext, args);
                let errors = [];
                for (let receiver of receivers) {
                    try {
                        receiver.apply(targetContext, args);
                    }
                    catch (e) {
                        errors.push(e);
                    }
                }
                if (errors.length > 0) {
                    // TODO pass errors to callback of some kind, like transmission.onError
                    setTimeout(() => {
                        throw errors[0];
                    });
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

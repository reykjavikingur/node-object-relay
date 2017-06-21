class FunctionRepeater {

    constructor(target, context) {
        let receivers = new Set();
        let proxy = new Proxy(target, {
            apply(target, ctx, args) {
                let rv = target.apply(ctx, args);
                for (let receiver of receivers) {
                    receiver.apply(context, args);
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

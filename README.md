# Object Relay

Node utility that connects one object to another and transmits setter and method invocations.

## Example

```
ObjectRelay = require('object-relay');

let relay = ObjectRelay.create({
    status: false,
    ping: function() { /* ... */ }
});

let proxy = relay.proxy;

let transmitter = relay.transmitter;

// ...
let transmission = transmitter.transmit({
    set status(value) {
        /* handle status change */
    }
    ping() {
        /* handle ping calls */
    }
});

// ...
proxy.status = true;
proxy.ping();

// ...
transmission.close();

```

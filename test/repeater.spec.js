const ObjectRelay = require('../lib/repeater');
const should = require('should');
const sinon = require('sinon');
require('should-sinon');

describe('ObjectRelay', () => {

    it('should be defined', () => {
        should(ObjectRelay).be.ok();
    });

    describe('instance with target having initial property value', () => {
        var target, instance, value, receiver, receiverSpy;
        beforeEach(() => {
            receiverSpy = sinon.spy();
            value = 87;
            target = {
                foo: value
            };
            instance = new ObjectRelay(target);
            receiver = {
                set foo(value) {
                    receiverSpy(value);
                }
            };
        });
        describe('when beginning to transmit', () => {
            beforeEach(() => {
                instance.transmitter.transmit(receiver);
            });
            it('should call receiver spy', () => {
                should(receiverSpy).be.calledWith(value);
            });
        });
    });

    // TODO test delete

    // TODO test when setter throws error

    // TODO test when method throws error

    // TODO test when adding method to proxy and then calling it

    // TODO test closing transmission and calling proxy method and confirming receiver method not called

    describe('instance with target having method', () => {
        var targetSpy, target, instance;
        beforeEach(() => {
            targetSpy = sinon.spy();
            target = {
                make: function () {
                    targetSpy();
                }
            };
            instance = new ObjectRelay(target);
        });
        it('should not yet have called the spy', () => {
            should(targetSpy).not.be.called();
        });
        describe('when calling method on proxy', () => {
            beforeEach(() => {
                instance.proxy.make();
            });
            it('should call spy', () => {
                should(targetSpy).be.called();
            });
        });
        describe('transmit', () => {
            var receiverSpy, receiver, transmission;
            beforeEach(() => {
                receiverSpy = sinon.spy();
                receiver = {
                    make: function () {
                        receiverSpy();
                    }
                };
                transmission = instance.transmitter.transmit(receiver);
            });
            it('should not yet have called the spy', () => {
                should(receiverSpy).not.be.called();
            });
            describe('when calling method on proxy', () => {
                beforeEach(() => {
                    instance.proxy.make();
                });
                it('should call spy', () => {
                    should(receiverSpy).be.called();
                });
            });
            describe('when closing transmission', () => {
                beforeEach(() => {
                    transmission.close();
                });
                describe('when calling method on proxy', () => {
                    beforeEach(() => {
                        instance.proxy.make();
                    });
                    it('should not call spy', () => {
                        should(receiverSpy).not.be.called();
                    });
                });
            });
        });
    });

    describe('instance with empty object as target', () => {

        var target, instance;

        beforeEach(() => {
            target = {};
            instance = new ObjectRelay(target);
        });

        it('should have proxy', () => {
            should(instance.proxy).be.ok();
        });

        describe('transmitter', () => {
            var transmitter;
            beforeEach(() => {
                transmitter = instance.transmitter;
            });
            it('should exist', () => {
                should(transmitter).be.ok();
            });
            it('should be able to transmit', () => {
                should(transmitter.transmit).be.a.Function();
            });
        });

        describe('receiver for property', () => {

            var receiver, receivedValue, transmission;

            beforeEach(() => {
                receiver = {
                    set foo(value) {
                        receivedValue = value;
                    }
                };
                transmission = instance.transmitter.transmit(receiver);
            });

            it('should return transmission', () => {
                should(transmission).be.ok();
            });

            describe('when setting property', () => {
                var value;
                beforeEach(() => {
                    value = 5;
                    instance.proxy.foo = value;
                });
                it('should receive value', () => {
                    should(receivedValue).eql(value);
                });
                it('should set property in proxy', () => {
                    should(instance.proxy.foo).eql(value);
                });

                describe('when ending transmission', () => {
                    beforeEach(() => {
                        transmission.close();
                    });

                    describe('when setting property', () => {
                        var lateValue;
                        beforeEach(() => {
                            lateValue = 6;
                            should(lateValue).not.eql(value);
                            instance.proxy.foo = lateValue;
                        });
                        it('should not receive value', () => {
                            should(receivedValue).eql(value);
                        });
                    });
                });
            });

        });

    });

});

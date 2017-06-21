const ObjectRelay = require('../');
const should = require('should');
const sinon = require('sinon');
require('should-sinon');

describe('ObjectRelay', () => {

    it('should be defined', () => {
        should(ObjectRelay).be.ok();
    });

    describe('instance with target having initial property value', () => {
        var target, instance, value, receiver, receivedValue;
        beforeEach(() => {
            value = 87;
            target = {
                foo: value
            };
            instance = new ObjectRelay(target);
            receiver = {
                set foo(value) {
                    receivedValue = value;
                }
            };
        });
        describe('when beginning to transmit', () => {
            beforeEach(() => {
                instance.transmitter.transmit(receiver);
            });
            it('should receive value', () => {
                should(receivedValue).eql(value);
            });
        });
    });

    // TODO test delete

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
            var receiverSpy, receiver;
            beforeEach(() => {
                receiverSpy = sinon.spy();
                receiver = {
                    make: function () {
                        receiverSpy();
                    }
                };
                instance.transmitter.transmit(receiver);
            });
            it('should not yet have called the spy', () => {
                should(receiverSpy).not.be.called();
            });
            describe('when calling method on proxy', () => {
                beforeEach(() => {
                    instance.proxy.make();
                });
                xit('should call spy', () => {
                    should(receiverSpy).be.called();
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

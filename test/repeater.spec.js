const ObjectRelay = require('../lib/repeater');
const should = require('should');
const sinon = require('sinon');
require('should-sinon');

describe('Repeater', () => {

    it('should be defined', () => {
        should(ObjectRelay).be.ok();
    });

    describe('instance with target having initial property value', () => {
        var target, instance, value;
        beforeEach(() => {
            value = 87;
            target = {
                foo: value
            };
            instance = new ObjectRelay(target);
        });
        describe('deleting property on proxy', () => {
            beforeEach(() => {
                // sanity test
                should(target.hasOwnProperty('foo')).be.ok();
                delete instance.proxy.foo;
            });
            it('should delete property on target', () => {
                should(target.hasOwnProperty('foo')).not.be.ok();
            });
        });
        describe('when beginning to transmit', () => {
            var receiver, receiverSpy;
            beforeEach(() => {
                receiverSpy = sinon.spy();
                receiver = {
                    set foo(value) {
                        receiverSpy(value);
                    }
                };
                instance.transmitter.transmit(receiver);
            });
            it('should call receiver spy', () => {
                should(receiverSpy).be.calledWith(value);
            });
        });
    });

    // TODO test when setter throws error

    // TODO test when method throws error

    describe('instance with target having method', () => {
        var targetSpy, target, instance;
        beforeEach(() => {
            targetSpy = sinon.spy();
            target = {
                make: function () {
                    targetSpy.apply(this, arguments);
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
            it('should call spy on correct context', () => {
                should(targetSpy).be.calledOn(target);
            });
        });
        describe('transmit', () => {
            var receiverSpy, receiver, transmission;
            beforeEach(() => {
                receiverSpy = sinon.spy();
                receiver = {
                    make: function () {
                        receiverSpy.apply(this, arguments);
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
                it('should call spy on receiver', () => {
                    should(receiverSpy).be.calledOn(receiver);
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

            var receiver, receiveValue, transmission;

            beforeEach(() => {
                receiveValue = sinon.spy();
                receiver = {
                    set foo(value) {
                        receiveValue(value);
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
                    should(receiveValue).be.calledWith(value);
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
                            should(receiveValue).be.calledWith(value);
                        });
                    });
                });

                describe('when deleting property', () => {
                    beforeEach(() => {
                        receiveValue.reset();
                        delete instance.proxy.foo;
                    });
                    it('should receive undefined', () => {
                        should(receiveValue).be.calledWith(undefined);
                    });
                });

            });

        });

    });

});

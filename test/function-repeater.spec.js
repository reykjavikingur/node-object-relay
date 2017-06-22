const should = require('should');
const sinon = require('sinon');
require('should-sinon');
const FunctionRepeater = require('../lib/function-repeater');

describe('FunctionRepeater', () => {

    it('should exist', () => {
        should(FunctionRepeater).be.ok();
    });

    describe('instance', () => {
        var targetSpy, target, instance;
        beforeEach(() => {
            targetSpy = sinon.spy();
            target = function () {
                targetSpy();
            };
            instance = new FunctionRepeater(target);
        });
        it('should exist', () => {
            should(instance).be.ok();
        });
        it('should not yet call spy', () => {
            should(targetSpy).not.be.called();
        });
        describe('when proxy is called', () => {
            beforeEach(() => {
                instance.proxy();
            });
            it('should call spy', () => {
                should(targetSpy).be.called();
            });
        });

        describe('beginning to transmit', () => {
            var receiverSpy, receiver, transmission;
            beforeEach(() => {
                receiverSpy = sinon.spy();
                receiver = function () {
                    receiverSpy();
                };
                transmission = instance.transmitter.transmit(receiver);
            });
            it('should not yet call spy', () => {
                should(receiverSpy).not.be.called();
            });
            describe('when proxy is called', () => {
                beforeEach(() => {
                    instance.proxy();
                });
                it('should call spy', () => {
                    should(receiverSpy).be.called();
                });
            });
            describe('when transmission is closed', () => {
                beforeEach(() => {
                    transmission.close();
                });
                describe('when proxy is called', () => {
                    beforeEach(() => {
                        receiverSpy.reset();
                        instance.proxy();
                    });
                    it('should not call spy', () => {
                        should(receiverSpy).not.be.called();
                    });
                });
            });
        });
    });

    describe('instance with target and context', () => {
        var targetSpy, context, instance;
        beforeEach(() => {
            targetSpy = sinon.spy();
            context = {
                id: 101,
                craft: function () {
                    targetSpy.apply(this, arguments);
                }
            };
            instance = new FunctionRepeater(context.craft, context);
        });
        describe('when calling proxy', () => {
            beforeEach(() => {
                instance.proxy();
            });
            it('should call spy with context', () => {
                should(targetSpy).be.calledOn(context);
            });
        });
    });

    describe('instance with contextual target but no explicit context', () => {
        var targetSpy, context, instance;
        beforeEach(() => {
            targetSpy = sinon.spy();
            context = {
                id: 101,
                craft: function () {
                    targetSpy.apply(this, arguments);
                }
            };
            instance = new FunctionRepeater(context.craft);
        });
        describe('when calling proxy', () => {
            beforeEach(() => {
                instance.proxy();
            });
            it('should call spy with context', () => {
                should(targetSpy).be.calledOn(instance);
            });
        });
    });

    // TODO test that target is called before receivers

    // TODO test when target throws error

    // TODO test when receiver throws error

    // TODO test target call return value

    // TODO test target call arguments

});

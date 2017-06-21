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
            var receiverSpy, receiver;
            beforeEach(() => {
                receiverSpy = sinon.spy();
                receiver = function () {
                    receiverSpy();
                };
                instance.transmitter.transmit(receiver);
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
        });
    });

    // TODO test that target is called before receivers

    // TODO test transmission.close()

    // TODO test when target throws error

    // TODO test when receiver throws error

    // TODO test context of receiver call

    // TODO test context of target call

    // TODO test target call return value

    // TODO test target call arguments

});

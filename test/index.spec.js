const ObjectRelay = require('../');
const should = require('should');

describe('ObjectRelay', () => {

    it('should be defined', () => {
        should(ObjectRelay).be.ok();
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

        xit('should have transmitter', () => {
            should(instance.transmitter).be.ok();
        });

    });

});

const ObjectRelay = require('../');
const Repeater = require('../lib/repeater');
const should = require('should');

describe('ObjectRelay', () => {

    it('should be Repeater', () => {
        should(ObjectRelay).eql(Repeater);
    });

});

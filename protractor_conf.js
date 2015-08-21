exports.config = {
    directConnect: false,

    framework: 'mocha',

    specs: ['test/e2e/**/*spec.js'],

    onPrepare: function() {
        'use strict';

        var chai = require('chai');
        var chaiAsPromised = require('chai-as-promised');

        GLOBAL.Q = require('q');
        GLOBAL.expect = chai.expect;

        chai.use(chaiAsPromised);
        chai.should();

        Object.defineProperty (
            protractor.promise.Promise.prototype,
            'should',
            Object.getOwnPropertyDescriptor(Object.prototype, 'should')
        );
    },

    mochaOpts: {
        reporter: 'dot',
        slow: 3000,
        timeout: 15000,
        colors: true
    }
};

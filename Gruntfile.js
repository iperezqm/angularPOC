'use strict';

module.exports = function(grunt) {
    if (!grunt.option('no-time')) {
        require('time-grunt')(grunt);
    }

    require('load-grunt-config')(grunt, {
        staticMappings: {
            configureProxy: 'grunt-connect-proxy'
        }
    });

    grunt.loadNpmTasks('grunt-notify');
};

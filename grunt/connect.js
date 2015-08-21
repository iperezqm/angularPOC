/* jshint node: true */
'use strict';

var querystring = require('querystring');

var nextResponse = null;

var linkDirectoryToRoot = function(connect, dir) {
    return connect.static(require('path').resolve(dir));
};

var testingRewrites = function(grunt) {
    var rewriteMiddleware = function(rules) {
        var rewriteModule = require('http-rewrite-middleware');
        return rewriteModule.getMiddleware(rules, { verbose: grunt.option('verbose') });
    };

    var rules = [];
    rules.push({ from: '^/quote-engine/(.*)$', to: '/quote-engine/$1.json' });
    rules.push({ from: '^/index.html/(.*)$', to: '/$1' });
    return rewriteMiddleware(rules);
};

var setNextResponse = function(request, response, next) {
    if (request.url === '/set-next-response') {
        var body = '';

        request.on('data', function(chunk) {
            body += chunk.toString();
        });

        request.on('end', function() {
            body = querystring.parse(body);
            nextResponse = {
                path: body.responseFilePath,
                code: body.responseCode
            };
            return response.end();
        });
    } else {
        next();
    }
};

module.exports = function(grunt) {
    return {
        options: {
            port: 19999,
            hostname: 'localhost'
        },
        e2e: {
            proxies: [
                {
                    context: '/service',
                    host: 'localhost',
                    port: 8080,
                    https: false
                }
            ],
            options: {
                useAvailablePort: true,
                middleware: function(connect) {
                    return [
                        setNextResponse,
                        function(request, response, next) {
                            if (nextResponse) {
                                var statusCode = parseInt(nextResponse.code);
                                if (statusCode) {
                                    response.writeHead(statusCode);
                                }
                                response.end(grunt.file.read('./mocks' + nextResponse.path + '.json'));
                                nextResponse = null;
                            } else {
                                next();
                            }
                        },
                        testingRewrites(grunt),
                        linkDirectoryToRoot(connect, './'),
                        linkDirectoryToRoot(connect, 'mocks'),
                        function(request, response, next) {
                            if (request.method === 'POST') {
                                var filePath = './mocks' + request.url;

                                if (grunt.file.exists(filePath)) {
                                    return response.end(grunt.file.read(filePath));
                                }
                            }
                            next();
                        },
                        require('grunt-connect-proxy/lib/utils').proxyRequest
                    ];
                }
            }
        }
    };
};

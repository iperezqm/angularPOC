'use strict';

angular.module('QMetric.internal.questionsetPOC').service('securedEndpointInterceptor', function(authenticationToken, configuration) {
    return {
        request: function(config) {
            _.each(configuration.backoffice.secured, function(endpoint) {
                if (config.url.indexOf(endpoint) === 0) {
                    config.headers.Authorization = 'bearer ' + authenticationToken.get();
                    return false;
                }
            });

            return config;
        }
    };
});

angular.module('QMetric.internal.questionsetPOC').config(function($httpProvider) {
    $httpProvider.interceptors.push('securedEndpointInterceptor');
});

angular.module('QMetric.internal.questionsetPOC').service('authenticationToken', function($cookies) {
    var cookieName;

    return {
        get: function() {
            return $cookies.get(cookieName);
        },
        initialize: function(newCookieName) {
            cookieName = newCookieName;
        }
    };
});

angular.module('QMetric.internal.questionsetPOC').service('backofficeUser', function(serverConfig, $q, $http, configuration, $window, authenticationToken) {
    var authenticate = function() {
        var deferredAuthenticate = $q.defer();

        serverConfig.get().then(function(cookieName) {
            authenticationToken.initialize(cookieName);
            if (!authenticationToken.get()) {
                $http.get(configuration.backoffice.login + $window.location.pathname.replace('/', '')).then(function(response) {
                    console.log('after login', response);
                    $window.location.href = response.data.url;
                });
            } else {
                deferredAuthenticate.resolve();
            }
        });

        return deferredAuthenticate.promise;
    };

    return {
        authenticate: authenticate
    };
});

angular.module('QMetric.internal.questionsetPOC').service('serverConfig', function($q, $http, configuration) {
    var cookieName;

    var get = function() {
        var resolve = function() {
            deferredGet.resolve(cookieName);
        };

        var deferredGet = $q.defer();

        if (cookieName) {
            resolve();
        } else {
            $http.get(configuration.backoffice.serverConfig).then(function(response) {
                cookieName = response.data.cookie;
                resolve();
            });
        }

        return deferredGet.promise;
    };

    return {
        get: get
    };
});

'use strict';

angular.module('QMetric.internal.questionsetPOC').service('securedEndpointInterceptor', function(authenticationToken, configuration) {
    var isSecured = function(endpointUrl, securedEndpoints) {
        var found = false;
        if (!securedEndpoints) {
            securedEndpoints = configuration.backoffice.secured;
        }
        angular.forEach(securedEndpoints, function(securedEndpointDefinition) {
            if (angular.isObject(securedEndpointDefinition)) {
                found = found || isSecured(endpointUrl, securedEndpointDefinition);
            } else {
                found = found || (endpointUrl.indexOf(securedEndpointDefinition) === 0);
            }
        });

        return found;
    };

    return {
        request: function(config) {
            if (isSecured(config.url)) {
                config.headers.Authorization = 'bearer ' + authenticationToken.get();
            }

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
                $http.get(configuration.backoffice.login + $window.location.pathname).then(function(response) {
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

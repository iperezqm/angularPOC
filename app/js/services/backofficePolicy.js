'use strict';

angular.module('QMetric.internal.questionsetPOC').service('backofficePolicy', function(configuration, $http) {
    return {
        load: function(policyId) {
            return $http.get(configuration.backoffice.secured.policy + '/' + policyId).then(function(response) {
                return response.data;
            });
        }
    };
});

'use strict';

angular.module('QMetric.internal.questionsetPOC').service('backofficePolicyAudit', function(configuration, $http) {
    return {
        load: function(policyId) {
            return $http.get(configuration.backoffice.secured.audit.policy + '/' + policyId).then(function(response) {
                return response.data;
            });
        }
    };
});

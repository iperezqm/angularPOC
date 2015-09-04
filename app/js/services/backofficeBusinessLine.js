'use strict';

angular.module('QMetric.internal.questionsetPOC').service('backofficeBusinessLine', function(configuration, $http) {
    return {
        load: function(businessLineId) {
            return $http.get(configuration.backoffice.secured.questionset + '/' + businessLineId).then(function(response) {
                return response.data;
            });
        }
    };
});

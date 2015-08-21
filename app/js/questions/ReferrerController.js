'use strict';

angular.module('QMetric.internal.questionsetPOC').controller('ReferrerController', function($scope, $http, configuration) {
    $http.get(configuration.backoffice.secured.referrers).then(function(response) {
        $scope.referrers = response.data;
    });
});

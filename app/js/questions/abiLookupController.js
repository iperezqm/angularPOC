'use strict';

angular.module('QMetric.internal.questionsetPOC').controller('abiLookupController', function($scope, $http, configuration) {
    $scope.getValues = function(val) {
        return $http.get(configuration.abiLookup + '/' + $scope.question.codeList, {
            params: {
                text: val
            }
        }).then(function(response) {
            return response.data;
        });
    };
});

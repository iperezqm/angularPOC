'use strict';

angular.module('QMetric.internal.questionsetPOC').controller('CustomerLoginController', function($scope, $rootScope, $http, configuration, $httpParamSerializerJQLike) {
    $scope.answers[$scope.question.id] = $scope.answers[$scope.question.id] || { };
    delete $scope.answers[$scope.question.id].loggedIn;

    $scope.searchEmail = function() {
        $http({
            method: 'POST',
            url: configuration.serviceUrl + '/' + $rootScope.enquiryId + '/' + 'customer',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: $httpParamSerializerJQLike({
                email: $scope.answers[$scope.question.id].email
            })
        }).then(function() {
            $scope.existing = true;
        }, function() {
            $scope.existing = false;
        });
    };
});

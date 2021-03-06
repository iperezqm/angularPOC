'use strict';

angular.module('QMetric.internal.questionsetPOC').controller('RosserlookupController', function($scope, $http, configuration) {
    $scope.email = $scope.answers[$scope.question.id] && $scope.answers[$scope.question.id].email;
    $scope.customer = $scope.answers[$scope.question.id] && $scope.answers[$scope.question.id].customerData;

    $scope.$watch('email', function(newVal, oldVal) {
        if (newVal !== oldVal) {
            $scope.customerData = null;
            $scope.customer = null;
            $scope.answers[$scope.question.id] = {
                email: $scope.email,
                create: true
            };
        }
    });

    $scope.lookup = function() {
        $http({
            method: 'POST',
            url: configuration.backoffice.secured.rosserlookup,
            data: {
                email: $scope.email,
                customerData: null
            }
        }).then(function(response) {
            $scope.customerData = response.data.customerData;
        });
    };

    $scope.select = function(customer) {
        $scope.customer = customer;
        $scope.answers[$scope.question.id].create = false;
        $scope.answers[$scope.question.id].customerData = customer;
    };
});

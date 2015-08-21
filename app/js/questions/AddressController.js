'use strict';

angular.module('QMetric.internal.questionsetPOC').controller('AddressController', function($scope, $http, configuration) {
    $scope.find = function() {
        $scope.matches = null;
        if ($scope.postcode) {
            $http.get(configuration.postcode, {
                params: {
                    postcode: $scope.postcode
                }
            }).then(function(response) {
                if (response.status !== 200) {
                    $scope.error = 'NOTFOUND';
                } else {
                    console.log(response.data);
                    $scope.matches = response.data;
                }
            });
        }
    };

    $scope.$watch('selectedAddress', function() {
        if ($scope.selectedAddress) {
            $http.get(configuration.address + '/' + $scope.selectedAddress).then(function(response) {
                var address = response.data;

                $scope.answers[$scope.question.id] = address;

                $scope.displayAddress = address.line1;
                $scope.displayAddress += address.line2 ? ', ' + address.line2 : '';
                $scope.displayAddress += address.line3 ? ', ' + address.line3 : '';
                $scope.displayAddress += address.line4 ? ', ' + address.line4 : '';
                $scope.displayAddress += ', ' + address.town;
                $scope.displayAddress += ', ' + address.postcode;
            });
        }
    });
});

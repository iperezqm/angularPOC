'use strict';

angular.module('QMetric.internal.questionsetPOC').controller('CalendarSelectController', function($scope, $filter) {
    if ($scope.answers[$scope.question.id]) {
        $scope.selectedDate = $scope.answers[$scope.question.id];
    }

    $scope.$watch('selectedDate', function() {
        $scope.answers[$scope.question.id] = $filter('date')($scope.selectedDate, 'yyyy-MM-dd');
    });
});

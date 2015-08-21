'use strict';

angular.module('QMetric.internal.questionsetPOC').controller('CalendarSelectController', function($scope, $filter) {
    $scope.$watch('selectedDate', function() {
        $scope.answers[$scope.question.id] = $filter('date')($scope.selectedDate, 'yyyy-MM-dd');
    });
});

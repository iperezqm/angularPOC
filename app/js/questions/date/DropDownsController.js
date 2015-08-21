'use strict';

angular.module('QMetric.internal.questionsetPOC').controller('DropDownsController', function($scope, $filter) {
    $scope.years = [];
    $scope.months = [];
    $scope.days = [];

    for (var year = 2015; year > 1915; year--) {
        $scope.years.push(year);
    }

    for (var month = 1; month <= 12; month++) {
        var m = new Date(2015, month - 1);
        $scope.months.push({
            month: month,
            name: $filter('date')(m, 'MMMM')
        });
    }

    for (var day = 1; day <= 31; day++) {
        $scope.days.push(day);
    }

    var setAnswer = function() {
        if ($scope.year && $scope.month && $scope.day) {
            $scope.answers[$scope.question.id] = $filter('date')(new Date($scope.year, $scope.month, $scope.day), 'yyyy-MM-dd');
        } else {
            $scope.answers[$scope.question.id] = null;
        }
    };

    $scope.$watch('year', setAnswer);
    $scope.$watch('month', setAnswer);
    $scope.$watch('day', setAnswer);
});

'use strict';

angular.module('QMetric.internal.questionsetPOC').controller('ImageselectController', function($scope) {
    $scope.isSelected = function(option) {
        return $scope.answers[$scope.question.id] === option.answer;
    };

    $scope.select = function(option) {
        $scope.answers[$scope.question.id] = option.answer;
    };
});

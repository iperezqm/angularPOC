'use strict';

angular.module('QMetric.internal.questionsetPOC').controller('ImageselectController', function($scope) {
    var currentOption;

    console.log($scope.question);

    $scope.select = function(option) {
        if (currentOption) {
            currentOption.selected = false;
        }
        currentOption = option;
        $scope.answers[$scope.question.id] = currentOption.answer;
        currentOption.selected = true;
    };
});

'use strict';

angular.module('QMetric.internal.questionsetPOC').controller('CollectionController', function($scope) {
    $scope.editing = true;
    $scope.currentAnswers = {};

    var finishEdition = function() {
        $scope.currentAnswers = {};
        $scope.editing = false;
    };

    $scope.save = function() {
        $scope.answers[$scope.question.id] = $scope.answers[$scope.question.id] || [];
        $scope.answers[$scope.question.id].push(angular.copy($scope.currentAnswers));
        finishEdition();
    };

    $scope.add = function() {
        $scope.editing = true;
    };

    $scope.cancel = finishEdition;
});

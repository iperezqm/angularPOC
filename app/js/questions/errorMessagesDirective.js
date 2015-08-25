'use strict';

angular.module('QMetric.internal.questionsetPOC').directive('errorMessages', function() {
    return {
        restrict: 'E',
        replace: true,
        scope: false,
        templateUrl: 'questions/errorMessages.tpl.html',
        link: function(scope) {
            scope.$watch('errors', function(newValue, oldValue) {
                if (newValue !== oldValue) {
                    var errorMessage = scope.errors && scope.errors[scope.question.id];
                    scope.questionForm.question.$setValidity('server', errorMessage ? false : true);
                    scope.questionForm.question.$setTouched();
                }
            });

            scope.$watch('answers[question.id]', function(newValue, oldValue) {
                if (newValue !== oldValue) {
                    scope.questionForm.question.$setValidity('server', true);
                }
            });
        }
    };
});

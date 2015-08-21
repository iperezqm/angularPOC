'use strict';

angular.module('QMetric.internal.questionsetPOC').directive('question', function() {
    return {
        restrict: 'E',
        scope: {
            question: '=',
            answers: '=',
            errors: '='
        },
        templateUrl: 'questionset/formSection/question.tpl.html',
        replace: true
    };
});

'use strict';

angular.module('QMetric.internal.questionsetPOC').directive('questionGroups', function() {
    return {
        restrict: 'E',
        scope: {
            groups: '=',
            triggerId: '=',
            answers: '=',
            errors: '='
        },
        templateUrl: 'questionset/formSection/questionGroups.tpl.html',
        replace: true
    };
});

'use strict';

angular.module('QMetric.internal.questionsetPOC').directive('formSection', function() {
    return {
        scope: {
            section: '=',
            answers: '=',
            errors: '='
        },
        restrict: 'E',
        templateUrl: 'questionset/formSection/formSection.tpl.html',
        replace: true
    };
});

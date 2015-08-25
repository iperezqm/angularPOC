'use strict';

angular.module('QMetric.internal.questionsetPOC').directive('questionset', function() {
    return {
        restrict: 'E',
        controller: 'QuestionsetController',
        templateUrl: 'questionset/questionset.tpl.html',
        replace: true,
        link: function(scope, element, attributes) {
            scope.provider = _.has(attributes, 'useBackoffice') ? 'backoffice' : 'website';

            var scrollToFirstError = function() {
                var firstInvalid = angular.element('.ng-invalid').get(0);
                if (firstInvalid) {
                    firstInvalid.scrollIntoView();
                }
            };

            scope.$watch('errors', scrollToFirstError);

            element.on('submit', scrollToFirstError);
        }
    };
});

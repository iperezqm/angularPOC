'use strict';

angular.module('QMetric.internal.questionsetPOC').directive('backofficeQuotes', function() {
    return {
        restrict: 'E',
        controller: 'BackofficeQuotesController',
        templateUrl: 'backofficeQuotes/backofficeQuotes.tpl.html',
        replace: true
    };
});

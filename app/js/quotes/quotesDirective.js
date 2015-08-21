'use strict';

angular.module('QMetric.internal.questionsetPOC').directive('quotes', function() {
    return {
        restrict: 'E',
        controller: 'QuotesController',
        templateUrl: 'quotes/quotes.tpl.html',
        replace: true
    };
});

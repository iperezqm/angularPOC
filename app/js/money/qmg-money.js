'use strict';

angular.module('QMetric.internal.questionsetPOC').filter('qmgMoney', function($filter) {
    return function(value) {
        if (!value) {
            return value;
        }
        return $filter('currency')(value.money ? value.money.amount : value.amount, '£', 2);
    };
});

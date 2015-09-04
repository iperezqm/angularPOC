'use strict';

angular.module('QMetric.internal.questionsetPOC').filter('qmgDate', function($filter) {
    return function(value) {
        if (!value) {
            return;
        }
        return $filter('date')(new Date(value), 'yyyy-MM-dd');
    };
});

angular.module('QMetric.internal.questionsetPOC').filter('qmgTime', function($filter) {
    return function(value) {
        if (!value) {
            return;
        }
        return $filter('date')(new Date(value), 'hh:mm:ss');
    };
});

angular.module('QMetric.internal.questionsetPOC').filter('qmgDateAndTime', function($filter) {
    return function(value) {
        if (!value) {
            return;
        }
        var date = new Date(value);
        return $filter('qmgDate')(date) + ' ' + $filter('qmgTime')(date);
    };
});

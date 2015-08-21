'use strict';

angular.module('QMetric.internal.questionsetPOC').filter('markdown', function($window, $sce) {
    return function(value) {
        return $sce.trustAsHtml(value && value !== '' ? $window.markdown.toHTML(value) : '');
    };
});

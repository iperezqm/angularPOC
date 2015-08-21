'use strict';

angular.module('QMetric.internal.questionsetPOC').service('questionsetBackends', function(websiteQuestionsetBackend, backofficeQuestionsetBackend) {
    return {
        website: websiteQuestionsetBackend,
        backoffice: backofficeQuestionsetBackend
    };
});

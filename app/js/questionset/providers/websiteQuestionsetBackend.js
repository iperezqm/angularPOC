'use strict';

angular.module('QMetric.internal.questionsetPOC').service('websiteQuestionsetBackend', function(configuration, $q, $http) {
    var getQuestionset = function(data) {
        var businessLine = data.businessLine;

        // curl '/enquiry/home2/12b6a10b-4ef8-4a02-9763-f44375005709'

        var questionsetPromise = (data.enquiryId) ?
            $http.get(configuration.serviceUrl + '/' + businessLine + '/' + data.enquiryId)
            : $http({
                method: 'POST',
                url: configuration.serviceUrl + '/' + businessLine
            });

        return questionsetPromise.then(function(response) {
            var contentLocation = response.headers()['content-location'];
            return $q.resolve({
                enquiryId: data.enquiryId || contentLocation.match(/.*\/([^\/]+)/)[1],
                sections: response.data.sections || response.data.form.sections,
                answers: response.data.answers || {}
            });
        });
    };

    var submit = function(parameters) {
        return $http({
            method: 'PUT',
            url: configuration.serviceUrl + '/' + parameters.businessLine + '/' + parameters.enquiryId,
            data: parameters.answers
        }).then(function(response) {
            if (Object.keys(response.data.errors).length === 1 && response.data.errors.global.length === 0) {
                return $q.resolve();
            } else {
                return $q.reject({
                    errors: response.data.errors
                });
            }
        });
    };

    return {
        getQuestionset: getQuestionset,
        submit: submit
    };
});


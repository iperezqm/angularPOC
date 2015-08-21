'use strict';

angular.module('QMetric.internal.questionsetPOC').service('websiteQuestionsetBackend', function(configuration, $q, $http) {
    var getQuestionset = function(businessLine) {
        var deferredData = $q.defer();

        $http({
            method: 'POST',
            url: configuration.serviceUrl + '/' + businessLine
        }).then(function(response) {
            var contentLocation = response.headers()['content-location'];
            deferredData.resolve({
                enquiryId: contentLocation.match(/.*\/([^\/]+)/)[1],
                sections: response.data.sections,
                answers: response.data.answers || {}
            });
        });

        return deferredData.promise;
    };

    var submit = function(parameters) {
        var dumpAnswers = function() {
            console.log(parameters.answers);
        };

        var deferredSubmit = $q.defer();

        dumpAnswers();
        $http({
            method: 'PUT',
            url: configuration.serviceUrl + '/' + parameters.businessLine + '/' + parameters.enquiryId,
            data: parameters.answers
        }).then(function(response) {
            if (Object.keys(response.data.errors).length === 1 && response.data.errors.global.length === 0) {
                deferredSubmit.resolve();
            } else {
                deferredSubmit.reject({
                    errors: response.data.errors
                });
            }
        }, function(error) {
            deferredSubmit.reject({
                exception: error
            });
        });

        return deferredSubmit.promise;
    };

    return {
        getQuestionset: getQuestionset,
        submit: submit
    };
});


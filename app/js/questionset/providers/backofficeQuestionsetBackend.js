'use strict';

angular.module('QMetric.internal.questionsetPOC').service('backofficeQuestionsetBackend', function($q, $http, configuration, backofficeUser, backofficeSession) {
    var getQuestionset = function(businessLine) {
        var deferredQuestionset = $q.defer();

        backofficeUser.authenticate().then(function() {
            $http({
                method: 'GET',
                url: configuration.backoffice.secured.questionset + '/' + businessLine
            }).then(function(response) {
                var sections = response.data.formDefinition.sections;
                _.each(sections, function(section) {
                    section.questions = _.reject(section.questions, function(question) {
                        var tags = question.tags;
                        return tags && tags.indexOf('website') !== -1 && tags.indexOf('backoffice') === -1;
                    });
                });
                sections = _.reject(sections, function(section) {
                    return section.questions.length === 0;
                });
                deferredQuestionset.resolve({
                    sections: sections,
                    version: response.data.publishedVersion
                });
            }, function(failure) {
                deferredQuestionset.reject(failure);
            });
        });

        return deferredQuestionset.promise;
    };

    var submit = function(parameters) {
        return backofficeSession.submitEnquiry(parameters.businessLine, parameters.version, parameters.answers);
    };

    return {
        getQuestionset: getQuestionset,
        submit: submit
    };
});

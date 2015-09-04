'use strict';

angular.module('QMetric.internal.questionsetPOC').service('backofficeQuestionsetBackend', function($q, configuration, backofficeUser, backofficeSession, backofficeBusinessLine) {
    var getQuestionset = function(data) {
        var businessLineId = data.businessLine;
        var deferredQuestionset = $q.defer();

        backofficeUser.authenticate().then(function() {
            var getEnquiry = businessLineId ? backofficeBusinessLine.load(businessLineId).then(function(businessLine) {
                return { businessLine: businessLine };
            }) : backofficeSession.loadSession(data.sessionId).then(function(session) {
                return $q.resolve(session.getEnquiryByIndex(data.enquiryIndex));
            });

            getEnquiry.then(function(enquiry) {
                var businessLine = enquiry.businessLine;
                var sections = businessLine.formDefinition.sections;
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
                    version: businessLine.publishedVersion,
                    answers: enquiry.applicationForm && enquiry.applicationForm.answers
                });
            }, function(failure) {
                deferredQuestionset.reject(failure);
            });
        });

        return deferredQuestionset.promise;
    };

    var submit = function(data) {
        var enquiryPromise = data.businessLine ? backofficeSession.new().then(function(session) {
            return session.newEnquiry(data.businessLine);
        }) : backofficeSession.loadSession(data.sessionId).then(function(session) {
            return $q.resolve(session.getEnquiryByIndex(data.enquiryIndex));
        });

        return enquiryPromise.then(function(enquiry) {
            return enquiry.submitAnswers(data.answers, data.version);
        });
    };

    return {
        getQuestionset: getQuestionset,
        submit: submit
    };
});

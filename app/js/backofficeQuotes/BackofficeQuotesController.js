'use strict';

angular.module('QMetric.internal.questionsetPOC').controller('BackofficeQuotesController', function($scope, backofficeUser, backofficeSession, $stateParams, usSpinnerService) {
    var initializing = true;

    var getQuotes = function() {
        usSpinnerService.spin('global');

        backofficeUser.authenticate().then(function() {
            backofficeSession.loadSession($stateParams.sessionId).then(function(session) {
                return session.quoteEnquiryByIndex($stateParams.enquiryIndex);
            }).then(function(enquiry) {
                $scope.quotes = enquiry.quotes;
                $scope.CID = enquiry.customerId;
                $scope.riskDescription = enquiry.factValues.values.riskDescription;

                $scope.questions = enquiry.businessLine.customisableQuestions;
                $scope.answers = enquiry.applicationForm.answers;

                $scope.amendUrlPart = enquiry.sessionId + '/' + enquiry.enquiryIndex;

                usSpinnerService.stop('global');

                if (initializing) {
                    $scope.$watch('answers', function() {
                        if (!initializing) {
                            enquiry.submitAnswers($scope.answers, enquiry.applicationForm.version)
                                .then(getQuotes).catch(function(error) {
                                    console.log(error);
                                });
                        }
                        initializing = false;
                    }, true);
                }
            });
        });
    };

    getQuotes();
});

'use strict';

angular.module('QMetric.internal.questionsetPOC').controller('BackofficeQuotesController', function($scope, backofficeUser, backofficeSession, $stateParams, usSpinnerService) {
    var initializing = true;

    var getQuotes = function() {
        usSpinnerService.spin('global');

        backofficeUser.authenticate().then(function() {
            backofficeSession.getQuotes($stateParams.sessionId, $stateParams.enquiryIndex).then(function(enquiry) {
                $scope.quotes = enquiry.quotes;
                $scope.CID = enquiry.customerId;
                $scope.riskDescription = enquiry.factValues.values.riskDescription;

                $scope.questions = enquiry.businessLine.customisableQuestions;
                $scope.answers = enquiry.applicationForm.answers;

                var businessLine = enquiry.businessLineId;
                var version = enquiry.applicationForm.version;

                usSpinnerService.stop('global');

                if (initializing) {
                    $scope.$watch('answers', function() {
                        if (!initializing) {
                            backofficeSession.submitEnquiry(businessLine, version, $scope.answers).then(getQuotes).catch(function(error) {
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

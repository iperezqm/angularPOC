'use strict';

angular.module('QMetric.internal.questionsetPOC').controller('BackofficeQuotesController', function($location, $timeout, $scope, backofficeUser, backofficeSession, $stateParams, usSpinnerService) {
    var initializing = true;
    var currentSession;

    var getQuotes = function() {
        usSpinnerService.spin('global');

        backofficeUser.authenticate().then(function() {
            backofficeSession.loadSession($stateParams.sessionId).then(function(session) {
                currentSession = session;
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

    $scope.select = function(quote) {
        quote.getDetails();
        $scope.selectedQuote = quote;
        $timeout(function() {
            angular.element('.quoteDetails button').get(0).scrollIntoView();
        });
    };

    $scope.coverIcon = function(cover) {
        var icon = 'glyphicon glyphicon-';

        switch (cover.tag) {
            case 'buildings':
                icon += 'home';
                break;
            case 'contents':
                icon += 'briefcase';
                break;
            case 'icon_alt_accommodation':
                icon += 'bed';
                break;
            case 'icon_cashcard':
                icon += 'credit-card';
                break;
            case 'icon_cashcards_home':
                icon += 'gbp';
                break;
            case 'icon_freezercontents':
                icon += 'asterisk';
                break;
            default:
                icon += 'star';
        }

        return icon;
    };

    $scope.addToBasket = function() {
        currentSession.addToBasket($stateParams.enquiryIndex, $scope.selectedQuote.productId).then(function() {
            $location.url('/backoffice/basket/' + $stateParams.sessionId);
        });
    };

    getQuotes();
});

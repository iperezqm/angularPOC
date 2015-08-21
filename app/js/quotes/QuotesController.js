'use strict';

angular.module('QMetric.internal.questionsetPOC').controller('QuotesController', function($scope, $http, configuration, $stateParams, usSpinnerService) {
    var initializing = true;

    var getQuotes = function() {
        usSpinnerService.spin('global');
        $http({
            method: 'POST',
            url: configuration.serviceUrl + '/' + $stateParams.businessLine + '/' + $stateParams.enquiryId + '/quote/'
        }).then(function(response) {
            $scope.quotes = response.data.quotes;
            $scope.questions = response.data.form;
            $scope.answers = response.data.answers;
            usSpinnerService.stop('global');

            if (initializing) {
                $scope.$watch('answers', function() {
                    if (!initializing) {
                        $http({
                            method: 'PUT',
                            url: configuration.serviceUrl + '/' + $stateParams.businessLine + '/' + $stateParams.enquiryId + '/',
                            data: $scope.answers
                        }).then(getQuotes).catch(function(error) {
                            console.log(error);
                        });
                    }
                    initializing = false;
                }, true);
            }
        });
    };

    getQuotes();
});

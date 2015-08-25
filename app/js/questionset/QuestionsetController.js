'use strict';

angular.module('QMetric.internal.questionsetPOC').controller('QuestionsetController', function($scope, questionsetBackends, $stateParams, $rootScope, $location, usSpinnerService) {
    var backend;
    var version;

    usSpinnerService.spin('global');

    $scope.$watch('provider', function() {
        if ($scope.provider) {
            backend = questionsetBackends[$scope.provider];

            backend.getQuestionset($stateParams).then(function(data) {
                $rootScope.enquiryId = data.enquiryId;
                $scope.sections = data.sections;
                $scope.answers = data.answers || {};
                version = data.version;
                usSpinnerService.stop('global');
            }, function(failure) {
                console.log(failure);
            });
        }
    });

    var submitData = function() {
        var parameters = {};

        if ($scope.provider === 'backoffice') {
            parameters.version = version;
            parameters.sessionId = $stateParams.sessionId;
            parameters.enquiryIndex = $stateParams.enquiryIndex;
        } else {
            parameters.enquiryId = $rootScope.enquiryId;
        }

        parameters.businessLine = $stateParams.businessLine;
        parameters.answers = $scope.answers;

        return parameters;
    };

    $scope.submit = function() {
        if ($scope.questionset.$valid) {
            usSpinnerService.spin('global');
            backend.submit(submitData()).then(function(parameters) {
                if ($scope.provider === 'backoffice') {
                    $location.url('/backoffice/quotes/' + parameters.sessionId + '/' + parameters.enquiryIndex);
                } else {
                    $location.path('/' + $stateParams.businessLine + '/' + $rootScope.enquiryId).replace();
                    $location.url('/quotes/' + $stateParams.businessLine + '/' + $rootScope.enquiryId + '/');
                }
            }).catch(function(failure) {
                usSpinnerService.stop('global');
                $scope.errors = failure.errors;
                if (failure.exception) {
                    console.log(failure.exception);
                }
            });
        } else {
            angular.forEach($scope.questionset.$error, function(errorType) {
                angular.forEach(errorType, function(questionForm) {
                    questionForm.question.$setTouched();
                });
            });
        }
    };
});

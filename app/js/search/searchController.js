'use strict';

angular.module('QMetric.internal.questionsetPOC').controller('BackofficeSearchController', function($rootScope, $scope, backofficeUser, $http, configuration, $location, $stateParams) {
    $scope.itemsPerPage = 5;

    var submitSearch = function(searchType, page) {
        return backofficeUser.authenticate().then(function() {
            return $http({
                url: configuration.backoffice.secured.search[searchType],
                params: {
                    query: $rootScope.searchText,
                    fromIndex: (page - 1) * $scope.itemsPerPage,
                    numberOfResultsOnPage: $scope.itemsPerPage
                }
            });
        });
    };

    $scope.getEnquiries = function() {
        submitSearch('enquiries', $scope.enquiriesPage).then(function(response) {
            if (response.data.enquiries.resultsPage.length) {
                $scope.enquiries = response.data.enquiries.resultsPage;
                $scope.totalEnquiries = response.data.enquiries.totalNumberOfResults;
            } else {
                $scope.enquiries = null;
            }
        });
    };

    $scope.getPolicies = function() {
        submitSearch('policies', $scope.policiesPage).then(function(response) {
            if (response.data.policies.resultsPage.length) {
                $scope.policies = response.data.policies.resultsPage;
                $scope.totalPolicies = response.data.policies.totalNumberOfResults;
            } else {
                $scope.policies = null;
            }
        });
    };

    $scope.search = function() {
        $location.search('query', $rootScope.searchText);
        $scope.enquiriesPage = 1;
        $scope.policiesPage = 1;
        $scope.getEnquiries();
        $scope.getPolicies();
    };

    if ($stateParams.query) {
        $rootScope.searchText = $stateParams.query;
    }

    if ($rootScope.searchText) {
        $scope.search();
    }
});

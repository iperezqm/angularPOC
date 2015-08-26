'use strict';

angular.module('QMetric.internal.questionsetPOC').controller('BasketController', function($scope, usSpinnerService, backofficeUser, backofficeSession, $stateParams, $sce) {
    usSpinnerService.spin('global');
    var currentSession;

    backofficeUser.authenticate().then(function() {
        backofficeSession.loadSession($stateParams.sessionId).then(function(session) {
            currentSession = session;
            $scope.basket = session.basket;
            usSpinnerService.stop('global');
        });
    });

    $scope.annual = function() {
        currentSession.purchaseWithCard().then(function(paymentUrl) {
            $scope.paymentUrl = $sce.trustAsResourceUrl(paymentUrl);
        });
    };
});

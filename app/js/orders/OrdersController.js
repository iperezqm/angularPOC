'use strict';

angular.module('QMetric.internal.questionsetPOC').controller('OrdersController', function($scope, backofficeUser, backofficeSession, $stateParams) {
    backofficeUser.authenticate().then(function() {
        return backofficeSession.loadSession($stateParams.sessionId);
    }).then(function(session) {
        $scope.orders = session.orders;
    });

    $scope.productName = function(order, policy) {
        return _.find(order.order, function(order) {
            return order.quote.id === policy.product;
        }).quote.productName;
    };

    $scope.customerId = function() {
        return '';
    };
});

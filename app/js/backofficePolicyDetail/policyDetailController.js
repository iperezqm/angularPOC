'use strict';

angular.module('QMetric.internal.questionsetPOC').controller('BackofficePolicyDetailController', function(backofficeUser, backofficePolicy, $stateParams, $scope, backofficeBusinessLine, $filter, backofficePolicyAudit, $modal) {
    var policyActions = function() {
        var canSetupFailedLoan = function() {
            return $scope.details.paymentMethod.paymentType === 'DEPOSIT_TAKEN' && $scope.details.status !== 'EXPIRED' && $scope.details.status  !== 'CANCELLED';
        };

        var canConvertFailedLoan = function() {
            return ($scope.details.paymentMethod.paymentType === 'DEPOSIT_TAKEN' ||
                $scope.details.paymentMethod.paymentType === 'LOAN' ||
                $scope.details.paymentMethod.paymentType === 'DIRECT_DEBIT_ESTABLISHED'
            ) && canCancel();
        };

        var canStartMTA = function() {
            return !$scope.details.isCancelled && $scope.details.status !== 'EXPIRED' && $scope.details.paymentMethod.paymentType !== 'DEPOSIT_TAKEN' && $scope.adjustments;
        };

        var canCancel = function() {
            return $scope.details.status !== 'EXPIRED' && $scope.details.status  !== 'CANCELLED';
        };

        var canUpdateNoClaimsProof = function() {
            return false;
        };

        var actionModal = function(templateUrl, options) {
            $modal.open(angular.extend({
                templateUrl: templateUrl,
                scope: $scope,
                backdrop: 'static'
            }, options));
        };

        var startMTA = function() {
            actionModal('backofficePolicyDetail/startMTA.tpl.html');
        };

        var startCancellation = function() {
            actionModal('backofficePolicyDetail/startCancellation.tpl.html', { size: 'lg' });
        };

        return [
            { label: 'Direct Debit: setup failed loan', isEnabled: canSetupFailedLoan, action: angular.noop },
            { label: 'Direct Debit: convert failed loan to annual', isEnabled: canConvertFailedLoan, action: angular.noop },
            { label: 'Start MTA process', isEnabled: canStartMTA, action: startMTA },
            { label: 'Start cancellation process', isEnabled: canCancel, action: startCancellation },
            { label: 'Update No Claims Proof', isEnabled: canUpdateNoClaimsProof, action: angular.noop }
        ];
    };

    backofficeUser.authenticate().then(function() {
        backofficePolicy.load($stateParams.policyId).then(function(policy) {
            backofficeBusinessLine.load(policy.businessLine).then(function(businessLine) {
                $scope.adjustments = businessLine.adjustmentFormDefinitions;
                $scope.product = $filter('filter')(businessLine.products, { id: policy.productId }, true)[0];
                $scope.actions = policyActions();
            });

            $scope.details = policy;
            $scope.details.status = policy.cancelled ? 'CANCELLED' : new Date(policy.expireDate) < new Date() ? 'EXPIRED' : 'PURCHASED';
            $scope.details.isCancelled = $scope.details.status === 'CANCELLED';
        });

        backofficePolicyAudit.load($stateParams.policyId).then(function(audit) {
            $scope.audit = audit;
        });
    });
});

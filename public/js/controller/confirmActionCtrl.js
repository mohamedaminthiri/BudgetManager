appBudgetManager.controller('confirmActionCtrl', function ($scope, $modalInstance, confirmationMessage) {

    $scope.confirmationMessage = confirmationMessage;

    $scope.ok = function () {
        $modalInstance.close();
    };

    $scope.cancel = function () {
        $modalInstance.dismiss();
    };
});
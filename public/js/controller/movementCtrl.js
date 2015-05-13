appBudgetManager.controller('movementCtrl', function ($scope, $modal, movementWebApi, provisionalPlanWebApi) {

        $scope.movementToSee = null;

        $scope.movementToWork = null;

        $scope.confirmationMessage = "Êtes vous sur de vouloir supprimer ce mouvement ?";

        $scope.inverseActiveState = function (movement, success_callback) {
            movement.active = !movement.active;
            movementWebApi.update(movement).then(function () {
                success_callback();
            }, function () {

            });
        };

        var confirmActionModalOpts = {
            templateUrl: 'views/partials/confirmAction', // Url du template HTML
            controller: 'confirmActionCtrl',
            resolve: {
                confirmationMessage: function () {
                    return $scope.confirmationMessage;
                }
            }
        };

        $scope.deleteClickListener = function (movement, success_callback) {
            if (movement === null) {
                return;
            }
            $scope.confirmationMessage = "Êtes vous sur de vouloir supprimer ce mouvement ?";
            var modalInstance = $modal.open(confirmActionModalOpts);
            modalInstance.result.then(function () {
                $scope.delete(movement, success_callback);
            }, function () {
                console.log("Suppression annulé.");
            });
        };

        $scope.delete = function (movement, success_callback) {
            movementWebApi.remove(movement).then(function () {
                success_callback();
            }, function () {

            });
        };

        var movementModalAddOrEditOpts = {
            templateUrl: 'views/partials/formMovement', // Url du template HTML
            controller: 'addMovementCtrl',
            resolve: {
                provisionalPlan: function () {
                    return $scope.provisionalPlan;
                },
                movementToWork: function () {
                    return $scope.movementToWork;
                }
            }
        };

        $scope.openModalToEditOrAddToProvisionalPlan = function (provisionalPlan, movementToWork, success_callback) {
            $scope.provisionalPlan = provisionalPlan;
            if (movementToWork === null) {
                $scope.movementToWork = new Movement();
            } else {
                $scope.movementToWork = movementToWork;
            }
            var modalInstance = $modal.open(movementModalAddOrEditOpts);
            modalInstance.result.then(function (movement) {
                $scope.movement = movement;
                if ($scope.movement.id === undefined || $scope.movement.id === null) {
                    provisionalPlanWebApi.addMovementToProvisionalPlan($scope.provisionalPlan.id, $scope.movementToWork)
                        .then(function () {
                            success_callback();
                        });
                }
                else {
                    movementWebApi.update($scope.movementToWork).then(function () {
                        success_callback();
                    }, function () {

                    });
                }
            }, function () {
                console.log('Modal dismissed at: ' + new Date());
            });
        };

        var movementModalDetailsOpts = {
            templateUrl: 'views/partials/detailsMovement', // Url du template HTML
            controller: 'detailsMovementCtrl',
            resolve: {
                movement: function () {
                    return $scope.movementToSee;
                }
            }
        };

        $scope.openMovementDetailsModal = function (movementToSee) {
            if (movementToSee === null) {
                console.error("The movement to see is null.");
            } else {
                $scope.movementToSee = movementToSee;
            }
            var modalInstance = $modal.open(movementModalDetailsOpts);
            modalInstance.result.then(function () {
            }, function () {
                console.log('Modal dismissed at: ' + new Date());
            });
        };
    }
);
/**
 * @desc Controllers of BudgetManagerV2
 * @namespace Controllers
 */
(function () {
    angular
        .module('appBudgetManager')
        .controller('movement.ctrl', MovementController);

    MovementController.$inject = ['$scope', '$modal', 'movementWebApi', 'provisionalPlanWebApi'];

    /**
     * @desc Controllers of Movements
     * @namespace MovementController
     * @memberOf Controllers
     */
    function MovementController($scope, $modal, movementWebApi, provisionalPlanWebApi) {
        (function init() {
            defineScope();
            defineListeners();
        })();


        /**
         * @desc Defines all $scope variables
         * @function defineScope
         * @memberOf Controllers.MovementController
         */
        function defineScope() {
            $scope.movementToSee = null;

            $scope.movementToWork = null;

            $scope.confirmationMessage = "Êtes vous sur de vouloir supprimer ce mouvement ?";
        }


        /**
         * @desc Attach view listeners to this controller
         * @function defineListeners
         * @memberOf Controllers.MovementController
         */
        function defineListeners() {
            $scope.inverseActiveStateClickListener = _inverseActiveState;
            $scope.openMovementDetailsModalClickListener = _openMovementDetailsModal;
            $scope.deleteClickListener = _openModalToConfirmDelete;
            $scope.modalToAddOrEditClickListener = _openModalToAddOrEdit;
        }


        /**
         * @desc Inverse active state of movement and call WS to save the change
         * @function _inverseActiveState
         * @param {Object} movement Movement to update this state
         * * @param {function} success_callback Callback for the success of webserivce call
         * @memberOf Controllers.MovementController
         */
        function _inverseActiveState(movement, success_callback) {
            movement.active = !movement.active;
            movementWebApi.update(movement).then(function () {
                success_callback(movement.provisionalPlanId);
            }, function () {

            });
        }


        /**
         * @desc Open a modal to display details informations about a movement
         * @function _openMovementDetailsModal
         * @param {Object} movementToSee Movement to display their details informations in modal
         * @memberOf Controllers.MovementController
         */
        function _openMovementDetailsModal(movementToSee) {
            var movementModalDetailsOpts = {
                templateUrl: 'views/partials/movement.details', // Url du template HTML
                controller: 'movement.details.ctrl',
                resolve: {
                    movement: function () {
                        return $scope.movementToSee;
                    }
                }
            };
            if (_.isNull(movementToSee)) {
                console.error("The movement to see is null.");
            } else {
                $scope.movementToSee = movementToSee;
            }
            var modalInstance = $modal.open(movementModalDetailsOpts);
            modalInstance.result.then(function () {
            }, function () {
                console.log('Modal dismissed at: ' + new Date());
            });
        }


        /**
         * @desc Open a modal to confirm action of deleting then call de delete webservice if user confirm action
         * @function _openModalToConfirmDelete
         * @param {Object} movement Movement to delete
         * @param {function} success_callback Callback for the success of delete webservice call
         * @memberOf Controllers.MovementController
         */
        function _openModalToConfirmDelete(movement, success_callback) {
            var confirmActionModalOpts = {
                templateUrl: 'views/partials/action.confirm', // Url du template HTML
                controller: 'action.confirm.ctrl',
                resolve: {
                    confirmationMessage: function () {
                        return $scope.confirmationMessage;
                    }
                }
            };
            if (_.isUndefined(movement) || _.isNull(movement)) {
                throw new Error('The parameter movement is undefined or null.');
            }
            $scope.confirmationMessage = "Êtes vous sur de vouloir supprimer ce mouvement ?";
            var modalInstance = $modal.open(confirmActionModalOpts);
            modalInstance.result.then(function () {
                _delete(movement, success_callback);
            }, function () {
                console.log("Suppression annulé.");
            });
        }


        /**
         * @desc Call the delete webservice
         * @function _delete
         * @param {Object} movement Movement to delete
         * @param {function} success_callback Callback for the success of delete webservice call
         * @memberOf Controllers.MovementController
         */
        function _delete(movement, success_callback) {
            movementWebApi.remove(movement).then(function () {
                success_callback(movement.provisionalPlanId);
            }, function () {

            });
        }


        /**
         * @desc Open a modal to add or edit movement depending this id value (null = add else edit)
         * @function _openModalToAddOrEdit
         * @param {Object} provisionalPlan Provisional plan to work
         * @param {Object} movementToWork Movement to add or edit
         * @param {function} success_callback Callback of save webservice call
         * @memberOf Controllers.MovementController
         */
        function _openModalToAddOrEdit(provisionalPlan, movementToWork, success_callback) {
            function openModal(success_callback) {
                var movementModalAddOrEditOpts = {
                    templateUrl: 'views/partials/movement.form', // Url du template HTML
                    controller: 'movement.add.ctrl',
                    resolve: {
                        provisionalPlanTitle: function () {
                            return $scope.provisionalPlan.name;
                        },
                        movementToWork: function () {
                            return $scope.movementToWork;
                        }
                    }
                };
                var modalInstance = $modal.open(movementModalAddOrEditOpts);
                modalInstance.result.then(function (movement) {
                    $scope.movementToWork = movement;
                    if ($scope.movementToWork.id === undefined || $scope.movementToWork.id === null) {
                        provisionalPlanWebApi.addMovement($scope.movementToWork)
                            .then(function () {
                                success_callback($scope.movementToWork.provisionalPlanId);
                            }, function (reason) {
                                throw new Error(reason);
                            });
                    }
                    else {
                        movementWebApi.update($scope.movementToWork).then(function () {
                            success_callback($scope.movementToWork.provisionalPlanId);
                        }, function (reason) {
                            throw new Error(reason);
                        });
                    }
                }, function () {
                    console.log('Modal dismissed at: ' + new Date());
                });
            }

            $scope.provisionalPlan = provisionalPlan;
            if (_.isUndefined(movementToWork)) {
                throw new Error('Parameter  movementToWork is undefined.');
            }
            if (_.isNull(movementToWork)) {
                //Build new movement by default
                $scope.movementToWork = app.data.autocomplete.Movement();
                if (_.isUndefined(provisionalPlan)) {
                    throw new Error('Can\'t assign an provisionalPlan.id value to movement to add because the parameter provisionalPlan is null');
                }
                //Assign to this movement the provisionalPlanId to add
                $scope.movementToWork.provisionalPlanId = provisionalPlan.id;
            } else {
                $scope.movementToWork = movementToWork;
            }
            openModal(success_callback);
        }
    }
})();
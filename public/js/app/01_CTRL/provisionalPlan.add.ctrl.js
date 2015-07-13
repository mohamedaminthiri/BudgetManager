/**
 * @desc Controllers of BudgetManagerV2
 * @namespace Controllers
 */
(function () {
    angular
        .module('appBudgetManager')
        .controller('provisionalPlan.add.ctrl', ProvisionalPlanAddController);

    ProvisionalPlanAddController.$inject = ['$scope', '$modalInstance', 'provisionalPlan'];

    /**
     * @desc Controllers of ProvisionalPlans
     * @namespace ProvisionalPlanAddController
     * @memberOf Controllers
     */
    function ProvisionalPlanAddController($scope, $modalInstance, provisionalPlan) {
        (function init() {
            defineScope();
            defineListeners();
        })();


        /**
         * @desc Defines all $scope variables
         * @function defineScope
         * @memberOf Controllers.ProvisionalPlanAddController
         */
        function defineScope() {
            $scope.provisionalPlan = provisionalPlan;
            $scope.mode = (provisionalPlan.id == null ? app.ui.manager.modal.mode.create : app.ui.manager.modal.mode.edit)
            $scope.modes = app.ui.manager.modal.mode;
        }


        /**
         * @desc Attach view listeners to this controller
         * @function defineListeners
         * @memberOf Controllers.ProvisionalPlanAddController
         */
        function defineListeners() {
            $scope.ok = _ok;
            $scope.cancel = _cancel;
        }


        /**
         * @desc Close the modal with a promise resolve to success
         * @function _ok
         * @memberOf Controllers.ProvisionalPlanAddController
         */
        function _ok() {
            $modalInstance.close($scope.provisionalPlan);
        }


        /**
         * @desc Close the modal with a promise resolve to error
         * @function _cancel
         * @memberOf Controllers.ProvisionalPlanAddController
         */
        function _cancel() {
            $modalInstance.dismiss("Ajout du plan prévisionel annulé");
        }

    }
})();
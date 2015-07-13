/**
 * @desc Controllers of BudgetManagerV2
 * @namespace Controllers
 */
(function () {
    angular
        .module('appBudgetManager')
        .controller('logout.ctrl', LogoutController);

    LogoutController.$inject = ['$rootScope', '$scope', '$state', 'authenticateWebApi'];

    /**
     * @desc Controllers of ProvisionalPlans
     * @namespace LogoutController
     * @memberOf Controllers
     */
    function LogoutController($rootScope, $scope, $state, authenticateWebApi) {
        (function init() {
            defineScope();
            defineListeners();
        })();


        /**
         * @desc Defines all $scope variables
         * @function defineScope
         * @memberOf Controllers.LogoutController
         */
        function defineScope() {
        }


        /**
         * @desc Attach view listeners to this controller
         * @function defineListeners
         * @memberOf Controllers.LogoutController
         */
        function defineListeners() {
            $scope.logout = _logout;
        }


        /**
         * @desc Call a factory to try disconnect user
         * @function _logout
         * @memberOf Controllers.LogoutController
         */
        function _logout() {
            authenticateWebApi.logout().then(function () {
                $rootScope.user = null;
                $state.go('home');
            });
        }
    }
})();
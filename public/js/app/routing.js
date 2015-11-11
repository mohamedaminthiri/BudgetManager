'use strict';

var isAuthenticated = function ($rootScope, $q, $http, $state) {
    var defer = $q.defer();
    $http.get('/isAuthenticated').success(function (data) {
        // Authenticated
        if (data.success !== undefined) {
            if (data.success === false) {
                console.log(data.message);
                $state.go('login');
            }
        } else {
            $rootScope.user = data;
            defer.resolve(true);
        }

    }).error(function () {
        $state.go('login');
    });
    return defer.promise;
};

appBudgetManager.config(function ($stateProvider, $urlRouterProvider) {

        // Système de routage
        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'views/home',
                controller: 'home.ctrl'
            })
            .state('login', {
                url: '/login',
                controller: 'login.ctrl',
                templateUrl: 'views/login'
            })
            .state('signup', {
                url: '/signup',
                controller: 'signup.ctrl',
                templateUrl: 'views/signup'
            })
            .state('userProfile', {
                url: '/myAccount',
                controller: 'user.profile.ctrl',
                templateUrl: 'views/user.profile',
                resolve: {
                    user: isAuthenticated
                }
            }).state('provisionalPlans', {
                url: '/provisionalPlans',
                templateUrl: 'views/provisionalPlan.list',
                controller: 'provisionalPlan.ctrl',
                resolve: {
                    provisionalPlans: function ($stateParams, provisionalPlanWebApi) {
                        try {
                            return provisionalPlanWebApi.findAll();
                        } catch (err) {
                            throw new Error(err);
                        }
                    },
                    user: isAuthenticated
                }
            }).state('provisionalPlanDetails', {
                url: 'provisionalPlans/:id',
                templateUrl: 'views/partials/provisionalPlan.details',
                controller: 'provisionalPlan.details.ctrl',
                resolve: {
                    provisionalPlan: function ($stateParams, provisionalPlanWebApi) {
                        try {
                            debugger;
                            return provisionalPlanWebApi.findById($stateParams.id);
                        } catch (err) {
                            throw new Error(err);
                        }
                    },
                    user: isAuthenticated
                }
            }).state('provisionalPlanDetailsStats', {
                url: 'provisionalPlans/:id/stats',
                templateUrl: 'views/partials/provisionalPlan.details.stats',
                controller: 'provisionalPlan.details.stats.ctrl',
                resolve: {
                    provisionalPlan: function ($stateParams, provisionalPlanWebApi) {
                        try {
                            return provisionalPlanWebApi.findById($stateParams.id);
                        } catch (err) {
                            throw new Error(err);
                        }
                    },
                    user: isAuthenticated
                }
            });

        $urlRouterProvider.otherwise('/');
    }
);
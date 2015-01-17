// public/js/appRoutes.js
    angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    $routeProvider

        // home page
        .when('/', {
            templateUrl: '/public/views/home.html',
            controller: 'MainController'
        })

        .when('/resumeshow', {
            templateUrl: 'views/resumeshow.html',
            controller: 'ResumeShowController'
        });

    $locationProvider.html5Mode(true);

}]);
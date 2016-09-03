var app = angular.module('myApp', [
	'ngRoute',
	'mainControllers'
]);

app.config(['$routeProvider', function($routeProvider) {
	$routeProvider
		.when('/', {
			templateUrl: 'ind.html',
			controller: 'dummyController'
		})
		.when('/login', {
			templateUrl: 'login.html',
			controller: 'authController'
		})
		.when('/signup', {
			templateUrl: 'signup.html',
			controller: 'authController'
		})
		.when('/main', {
			templateUrl: 'main.html',
			controller: 'myController'
		})
		.when('/write', {
			templateUrl: 'write.html',
			controller: 'writeController'
		})
		.when('/read', {
			templateUrl: 'read.html',
			controller: 'readController'
		})
		.when('/test', {
			templateUrl: 'test.html',
			controller: 'myController'
		});
}]);
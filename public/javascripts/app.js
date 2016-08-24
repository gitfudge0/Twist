var app = angular.module('myApp', [
	'ngRoute',
	'mainControllers'
]);

app.config(['$routeProvider', function($routeProvider) {
	$routeProvider
		.when('/', {
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
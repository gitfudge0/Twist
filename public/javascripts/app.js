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
		.when('/test', {
			templateUrl: 'test.html',
			controller: 'myController'
		});
}]);
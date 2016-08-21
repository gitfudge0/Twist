var mainControllers = angular.module('mainControllers', []);



mainControllers.controller('myController', ['$scope', '$http', function($scope, $http) {
	$scope.title = 'Kickass Achievement';
	$scope.test = '';
	$scope.result = '';
	$scope.nodeSend = function() {
		$http
			.post('/values/test', {
				val: $scope.test
			})
			.success(function(data) {
				console.log(data);
				$scope.result = data;
			})
			.error(function(data) {
				console.log(data);
			});
	};
}]);

mainControllers.directive('binder', function() {
	return {
		scope: true
	};
});

mainControllers.controller('writeController', ['$scope', '$http', function($scope, $http) {

	var postid = '';
	var characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for( var i = 0; i < 6; i += 1){
        var index = Math.floor(Math.random() * (36)) + 1;
        postid += characters[index];
    }
	$scope.section_counter = 1;
	$scope.continued_from = 'None';
	$scope.new_continued_from = 'None';
	$scope.sections = [{
		title: '-- Select --',
		section_id: 'aaaa'
	}];
	$scope.selectedItem = $scope.sections[0];
	$scope.entries = [];
	$scope.continues = [];
	$scope.newEntry = {
		section_id: '',
		title: '',
		desc: '',
		body: '',
		connected_to: ''
	};

	$scope.newSave = function() {
		$scope.section_id = postid + '_SEC' + $scope.section_counter;
		$scope.newEntry.section_id = $scope.section_id;
		$scope.entries.push($scope.newEntry);
		$scope.sections.push({
			title: $scope.newEntry.title,
			section_id: $scope.section_id
		});
		console.log('Section ID: ' + $scope.section_id);
		console.log($scope.entries);
		$scope.selectedItem = $scope.sections[($scope.sections.length - 1)];
	};

	$scope.newAdd = function() {
		$scope.continued_from = $scope.selectedItem.title;
		$('#selector option[value="' + $scope.section_id + '"]').attr("selected", "selected");
		$scope.new_continued_from = $scope.selectedItem.title;
		var element = document.getElementById("spanbind");
		angular.element(element).scope().$destroy();
		element.removeAttribute('id');
		$scope.newEntry = {
			section_id: '',
			title: '',
			desc: '',
			body: '',
			connected_to: ''
		};
		$scope.section_counter += 1;
		console.log('New Addition');
		console.log('Length: ' + ($scope.sections.length - 1));
		
	};

}]);
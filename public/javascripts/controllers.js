var mainControllers = angular.module('mainControllers', ['ngStorage']).run(function($rootScope) {
	$rootScope.authenticated = false;
	$rootScope.currentUser = '';
});

mainControllers.directive('binder', function() {
	return {
		scope: true
	};
});

mainControllers.controller('dummyController', ['$scope', '$http', '$rootScope', function($scope, $http, $rootScope) {
	if($rootScope.authenticated === true) {
		$location.path('/main');
	}
}]);

mainControllers.controller('myController', ['$scope', '$http', '$rootScope', '$location', function($scope, $http, $rootScope, $location) {

	// if($rootScope.authenticated === false) {
	// 	$location.path('/');
	// }

	
	$http
		.post('/values/getUser')
		.success(function(data) {
			$rootScope.currentUser = data;
		});


}]);


mainControllers.controller('writeController', ['$scope', '$http', '$rootScope', function($scope, $http, $rootScope) {

	var postid = '';
	var characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    while( true ) {
    	for( var i = 0; i < 6; i += 1){
	        var index = Math.floor(Math.random() * (36)) + 1;
	        postid += characters[index];
	    }
	    if (postid.length <= 6) {
	    	break;
	    } else {
	    	postid = '';
	    }	
    }
    
	$scope.section_counter = 1;
	$scope.continued_from = 'None';
	$scope.new_continued_from = 'None';
	$scope.sections = [{
		title: '-- Select --',
		section_id: ''
	}];
	$scope.selectedItem = $scope.sections[0];
	$scope.entries = [];
	$scope.newEntry = {
		section_id: '',
		title: '',
		desc: '',
		body: '',
		connected_to: ''
	};

	$scope.setIntro = function() {
		var el = document.getElementById("intro-details");
		el.style.display = 'none';
		$http({
			method: 'POST',
			url: '/values/save',
			data: {
				part: 'intro',
				userid: 'theDiggu',
				postid: postid,
				title: $scope.intro.title,
				desc: $scope.intro.desc
			}
		})
		.success(function(data) {
			console.log(data);
		});
	};

	$scope.newSave = function() {
		$scope.section_id = 'theDiggu_' + postid + '_SEC' + $scope.section_counter;
		$scope.newEntry.section_id = $scope.section_id;
		$scope.newEntry.connected_to = $scope.selectedItem.section_id;

		$scope.entries.push($scope.newEntry);
		$scope.sections.push({
			title: $scope.newEntry.title,
			section_id: $scope.section_id
		});

		console.log('Section ID: ' + $scope.section_id);
		console.log($scope.entries[($scope.entries.length - 1)]);
		$scope.selectedItem = $scope.sections[($scope.sections.length - 1)];
		$http({
			method: 'POST',
			url: '/values/save',
			data: {
				part: 'content',
				postid: postid,
				val: $scope.entries[($scope.entries.length - 1)]
			}
		})
		.success(function(data) {
			console.log(data);
		});
	};

	$scope.newAdd = function() {
		$scope.continued_from = $scope.selectedItem.title;
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
	};

}]);



mainControllers.controller('readController', ['$scope', '$http', '$localStorage', '$rootScope',  function($scope, $http, $localStorage, $rootScope) {

	$scope.storage = $localStorage;
	$scope.storage.nextContent = [];
	$scope.storage.nextSection = [];
	$scope.storage.currPost = [];
	$scope.storage.allSections = [];



	$scope.display = false;
	$scope.result = [];
	$scope.currentSection = '';
	
	$http({
		method: 'POST',
		url: '/values/list',
	})
	.success(function(data) {
		$scope.posts = data;
	});

	$scope.postDetails = function(postid) {

		$scope.currentSection = '';
		$http({
			method: 'POST',
			url: '/values/post',
			data: {
				type: 'main',
				postid: postid
			}
		})
		.success(function(data) {
			$scope.storage.currPost = data[0];
			$scope.display = true;
			$scope.currentSection = data[0].content[0].sectionid;
			getSections($scope.currentSection);
		});
	};

	$scope.continuePosts = function(sectionid) {
		var element = document.getElementById("binder");
		angular.element(element).scope().$destroy();
		element.removeAttribute('id');

		for(section in $scope.storage.nextSection) {
			var el = document.getElementById($scope.storage.nextSection[section]);
			if($scope.storage.nextSection[section] == sectionid) {
				el.classList.remove('col-md-3');
				el.classList.add('col-md-12');
			} else{
				el.style.display = 'none';	
			}
			
		}

		getSections(sectionid);
	};


	function getSections(section) {
		$scope.storage.allSections.push(section);
		$scope.storage.nextContent = [];
		$scope.storage.nextSection = [];
		$http({
			method: 'POST',
			url: '/values/post',
			data: {
				type: 'getsection',
				sectionid: section
			}
		})
		.success(function(data) {
			for(datum in data) {
				$scope.storage.nextSection.push(data[datum].sectionid);
				getContent(data[datum].sectionid);
			}
		});
	};

	function getContent(sect) {
		$scope.nextContent = [];
		$http({
			method: 'POST',
			url: '/values/post',
			data: {
				type: 'getcontent',
				sectionid: sect
			}
		})
		.success(function(data) {
			$scope.storage.nextContent.push(data[0])
		});	
	};	
	

}]);

mainControllers.controller('authController', ['$scope', '$http', '$location', '$rootScope', '$localStorage', function($scope, $http, $location, $rootScope, $localStorage) {
	$scope.storage = $localStorage;
	//$scope.storage.newUser = {};
	$scope.user = {
		username: '',
		password: ''
	};
	$scope.errorMessage = '';

	$scope.signup = function() {
		$http
			.post('/auth/signup', $scope.user)
			.success(function(data) {
				if(data.state == 'success') {
					$scope.errorMessage = data.message;	
					$location.path('/test');
					$rootScope.currentUser = data.user;
					$scope.storage.newUser = data.user;
				} 
				$scope.errorMessage = data.message;	
			});
	};

	$scope.login = function() {
		$http
			.post('/auth/login', $scope.user)
			.success(function(data) {
				console.log(data);
				if(data.state == 'success') {
					$rootScope.currentUser = data.user;
					$scope.errorMessage = data.message;	
				} 
				$scope.errorMessage = data.message;	
			});
	};
}]);



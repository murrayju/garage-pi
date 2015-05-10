define [], () ->
	BaseCtrl: [
		'$scope'
		'$http'
		(
			$scope
			$http
		) ->
			$scope.config = {}

			$http.get('/api/config').then (response) ->
				angular.copy(response.data, $scope.config)
	]

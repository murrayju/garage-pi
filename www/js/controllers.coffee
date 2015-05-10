define [], () ->
	BaseCtrl: [
		'$scope'
		'$http'
		(
			$scope
			$http
		) ->
			$scope.config = {}

			$http.get('/api/config').then (config) ->
				angular.copy($scope.config, config)
	]

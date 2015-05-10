define [], () ->
	garageDoor: [
		'$http'
		'socket'
		'status'
		'msgLogSvc'
		(
			$http
			socket
			status
			msg
		) ->
			restrict: 'E'
			scope:
				door: '='
				index: '='
			templateUrl: 'garageDoor.html'
			link: (scope, element, attrs) ->
				status.$promise.then ->
					scope.status = status[scope.index]

					scope.trigger = ->
						$http.post("/api/trigger/#{scope.index}").then(
							(response) ->
								if !response?.data?.error
									msg.success('Door triggered')
								else
									msg.error(response?.data?.error)
							(err) ->
								msg.error("Request failed: #{err}")
						)

					scope.doorOpen = -> scope.status?.up && !scope.status?.down

					scope.doorClosed = -> scope.status?.down && !scope.status?.up

					scope.doorUnknown = -> !(scope.doorOpen() || scope.doorClosed())
	]

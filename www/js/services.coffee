define [
	'io'
	'angular'
], (
	io
	angular
) ->
	return services =
		socket: [
			'$rootScope'
			(
				$rootScope
			) ->
				socket = io()

				return svc =
					on: (eventName, callback) ->
						socket.on eventName, (args...) ->
							$rootScope.$apply ->
								callback?.apply(socket, args)

					emit: (eventName, data, callback) ->
						socket.emit eventName, data, (args...) ->
							$rootScope.$apply ->
								callback?.apply(socket, args)
		]

		status: [
			'$q'
			'socket'
			(
				$q
				socket
			) ->
				status = []
				defer = $q.defer()
				status.$promise = defer.promise

				socket.on 'status', (data) ->
					if status.length != data.length
						angular.copy(data, status)
						defer.resolve(status)
					else
						angular.copy(stat, status[i]) for stat, i in data

				return status
		]

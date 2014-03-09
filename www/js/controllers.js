define([],	function () {
	var ctrl = {};

	ctrl.BaseCtrl = function ($scope) {

	};

	ctrl.openerCtrl = ['$scope', '$http', '$interval', '$stateParams', 'socket', 'msgLogSvc', function ($scope, $http, $interval, $stateParams, socket, msg) {
        $scope.doorNum = parseInt($stateParams.id, 10) || 0;
        $scope.status = [];

        var trackProgress = function () {
            var opening = $scope.doorClosed();
        };

		$scope.trigger = function () {
			$http.post('/api/trigger/' + $scope.doorNum)
				.then(function (response) {
					if (!response.data.error) {
						msg.success('Door triggered');
					} else {
						msg.error(response.data.error);
					}
				}, function (err) {
					msg.error('No response from server');
				});
		};

        $scope.doorOpen = function () {
            return $scope.status && ($scope.status.length > $scope.doorNum) && $scope.status[$scope.doorNum].up && !$scope.status[$scope.doorNum].down;
        };

        $scope.doorClosed = function () {
            return $scope.status && ($scope.status.length > $scope.doorNum) && $scope.status[$scope.doorNum].down && !$scope.status[$scope.doorNum].up;
        };

        $scope.doorUnknown = function () {
            return !($scope.doorOpen() || $scope.doorClosed());
        };

        socket.on('status', function (data) {
            $scope.status = data;
        });
	}];

	return ctrl;
});

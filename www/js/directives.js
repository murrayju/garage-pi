define([],	function () {
	var dir = {};

	dir.garageDoor = [
        '$http',
        '$interval',
        'socket',
        'status',
        'msgLogSvc',
        function ($http, $interval, socket, status, msg) {
            return {
                restrict: 'E',
                scope:{
                    door:'='
                },
                templateUrl: 'garageDoor.html',
                link: function($scope, element, attributes) {
                    var doorNum = $scope.door.number;
                    status.$promise.then(function () {
                        $scope.status = status[doorNum];

                        $scope.trigger = function () {
                            $http.post('/api/trigger/' + doorNum)
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
                            return $scope.status.up && !$scope.status.down;
                        };

                        $scope.doorClosed = function () {
                            return $scope.status.down && !$scope.status.up;
                        };

                        $scope.doorUnknown = function () {
                            return !($scope.doorOpen() || $scope.doorClosed());
                        };
                    });
                }
            }
        }
    ];

	return dir;
});

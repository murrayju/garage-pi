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


                    var doorNum=$scope.door.number;
                    $scope.status = status[doorNum];

                    var trackProgress = function () {
                        var opening = $scope.doorClosed();
                    };

                    $scope.trigger = function () {
                        var doorWasOpen = $scope.doorOpen();
                        var doorWasClosed = $scope.doorClosed();

                        $http.post('/api/trigger/' + doorNum)
                            .then(function (response) {
                                if (!response.data.error) {
                                    msg.success('Door triggered');
                                    if (doorWasClosed){ $scope.door.opening=true; $scope.door.closing=false; }
                                    if (doorWasOpen){ $scope.door.closing=true; $scope.door.opening=false; }

                                } else {
                                    msg.error(response.data.error);
                                }
                            }, function (err) {
                                msg.error('No response from server');
                            });
                    };

                    $scope.doorOpen = function () {
                        return $scope.status && $scope.status.up && !$scope.status.down;
                    };

                    $scope.doorClosed = function () {
                        return $scope.status && $scope.status.down && !$scope.status.up;
                    };

                    $scope.doorUnknown = function () {
                        return !($scope.doorOpen() || $scope.doorClosed());
                    };
                }
            }
        }
    ];

	return dir;
});

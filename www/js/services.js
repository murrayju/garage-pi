define(['io', 'angular'],	function (io, angular){
    var service = {};

    service.socket = function ($rootScope) {
        var socket = io();
        return {
            on: function (eventName, callback) {
                socket.on(eventName, function () {  
                    var args = arguments;
                    $rootScope.$apply(function () {
                        callback.apply(socket, args);
                    });
                });
            },
            emit: function (eventName, data, callback) {
                socket.emit(eventName, data, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        if (callback) {
                            callback.apply(socket, args);
                        }
                    });
                })
            }
        };
    };

    service.status = ['$q', 'socket', function($q, socket) {
        var status = [];
        var defer = $q.defer();
        status.$promise = defer.promise;

        socket.on('status', function (data) {
            if (status.length != data.length) {
                angular.copy(data, status);
                defer.resolve(status);
            } else {
                angular.forEach(data, function (stat, i) {
                    angular.copy(stat, status[i]);
                });
            }
        });

        return status;
    }];

    return service;
});

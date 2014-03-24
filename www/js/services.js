define(['io', 'angular'],	function (io, angular){
    var service = {};

    service.socket = function ($rootScope) {
        var socket = io.connect();
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

    service.status = function(socket) {
        var status = [];

        socket.on('status', function (data) {
            status.length = 0;
            angular.forEach(data, function (stat) {
                status.push(stat);
            });
        });

        return status;
    };

    return service;
});

define([],	function () {
	var ctrl = {};

	ctrl.BaseCtrl = function ($scope) {

	};

	ctrl.openerCtrl = ['$scope', '$http', '$interval', 'msgLogSvc', function ($scope, $http, $interval, msg) {

		$scope.trigger = function (id) {
			$http.post('/api/trigger/' + id)
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

		$interval(function () {
			$http.get('/api/status')
				.then(function (response) {
					if (response.data.error) {
						msg.error(response.data.error);
					} else {
						$scope.status = response.data.data;
					}
				});
		}, 1000);
	}];

	return ctrl;
});

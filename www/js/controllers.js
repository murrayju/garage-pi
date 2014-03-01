define([],	function () {
	var ctrl = {};

	ctrl.BaseCtrl = function ($scope) {

	};

	ctrl.openerCtrl = ['$scope', '$http', 'msgLogSvc', function ($scope, $http, msg) {

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
	}];

	return ctrl;
});
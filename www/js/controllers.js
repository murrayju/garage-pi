define([],	function () {
	var ctrl = {};

	ctrl.BaseCtrl = function ($scope) {
        $scope.doors=[{name:'door0', number:0},{name:'door1', number:1}];
	};

	return ctrl;
});

define([],	function () {
	var ctrl = {};

	ctrl.BaseCtrl = function ($scope) {
        $scope.doors = [
            {
                name: 'Weight Bench',
                number: 0
            },
            {
                name: 'Where Russell used to park',
                number: 1
            }
        ];
	};

	return ctrl;
});

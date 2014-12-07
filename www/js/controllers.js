define([],	function () {
	var ctrl = {};

	ctrl.BaseCtrl = function ($scope) {
        $scope.doors = [
            {
                name: 'Weight Bench',
                number: 0,
                img: 'img/left.png'
            },
            {
                name: 'Where Russell parked',
                number: 1,
                img: 'img/right.png'
            }
        ];
	};

	return ctrl;
});

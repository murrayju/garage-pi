define(['angular'], function (angular) {
	var dir = {};

	dir.progressBar = function () {
		return {
			restrict: 'E',
			templateUrl: 'progress.html',
            scope: {
                percent: '=',
                skin: '=?'
            },
            link: function (scope, element, attrs) {
               scope.skinClass = function () {
                   return {
                        'progress-bar-success': scope.skin === 'success',
                        'progress-bar-warning': scope.skin === 'warning',
                        'progress-bar-danger': scope.skin === 'danger',
                        'progress-bar-info': scope.skin === 'info'
                   };
               };

               scope.striped = attrs.striped !== undefined;
            }
		};
	};

	return angular.module('progress', [])
		.directive(dir);
});

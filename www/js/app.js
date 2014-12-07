// define the dependencies with requirejs
requirejs.config({
	baseUrl: 'js',
	waitSeconds: 0,

	paths: {
		jquery: "/bower_components/jQuery/dist/jquery.min",
		angular: "/bower_components/angular/angular.min",
        io: "/socket.io/socket.io"
	},

	shim: {
		angular: {
			deps: ['jquery'],
			exports: 'angular'
		}
	}
});

// This is the main application entry point
// bootstraps the angularjs app with the dom
requirejs(['angular', 'controllers', 'directives', 'services', 'msgLog'], function (angular, ctrl, dir, svc) {
	angular.element().ready(function () {

		var mod = angular.module('MainAppModule', ['msgLog'])
            .factory(svc)
			.controller(ctrl)
			.directive(dir);

		angular.bootstrap(document, [mod.name]);
	});
});

// define the dependencies with requirejs
requirejs.config({
	baseUrl: 'js',
	waitSeconds: 0,

	paths: {
		jquery: "/bower_components/jQuery/dist/jquery.min",
		'jquery.bootstrap': "/bower_components/bootstrap/dist/js/bootstrap.min",
		angular: "/bower_components/angular/angular.min",
		'angular.ui.router': "/bower_components/angular-ui-router/release/angular-ui-router",
		fastclick: "/bower_components/fastclick/lib/fastclick",
        io: "/bower_components/socket.io-client/dist/socket.io.min"
	},

	shim: {
		angular: {
			deps: ['jquery'],
			exports: 'angular'
		},
		'angular.ui.router': ['angular'],
		'jquery.bootstrap': ['jquery']
	}
});

// This is the main application entry point
// bootstraps the angularjs app with the dom
requirejs(['angular', 'configuration', 'controllers', 'services', 'fastclick', 'progress', 'msgLog', 'angular.ui.router', 'jquery.bootstrap'], function (angular, config, ctrl, svc, fastclick) {
	angular.element().ready(function () {

		var mod = angular.module('MainAppModule', ['progress', 'msgLog', 'ui.router'])
			.config(config)
            .factory(svc)
			.controller(ctrl);

		angular.bootstrap(document, [mod.name]);
		fastclick.attach(document.body);
	});
});

// This is the main angularjs module configuration
define([], function () {
	return ['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

		$urlRouterProvider.otherwise("/");

		$stateProvider
			.state('opener', {
				url: '/',
				templateUrl: 'opener.html'
			});
	}];
});
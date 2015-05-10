define [
	'jquery'
	'angular'
	'cs!app'
], (
	$
	angular
	app
) ->
	$ ->
		angular.bootstrap(document, [app.name])

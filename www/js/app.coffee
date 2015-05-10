define [
	'angular'
	'cs!controllers'
	'cs!directives'
	'cs!services'
	'msgLog'
	'less!../less/main'
], (
	angular
	ctrl
	dir
	svc
	msg
) ->
	angular.module('GaragePiApp', [msg.name])
		.factory(svc)
		.controller(ctrl)
		.directive(dir)

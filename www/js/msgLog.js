/*global define */

define(['angular'], function (angular) {
	var directive = {};
	var factory = {};

	factory.msgLogSvc = ['$timeout', '$log', function ($timeout, $log) {
		var svc = {
			autoHide: 5000,
			autoDismiss: false,
			messages: []
		};

		var add = function (type, txt, title, alert) {
			var msg = {
				type: type,
				txt: txt,
				title: title,
				dismissed: false,
				alert: alert,
				icon: function () {
					return {
						'fa-check': type === 'success',
						'fa-info-circle': type === 'info',
						'fa-warning': type === 'warn',
						'fa-exclamation-circle': type === 'error',
						'fa-bug': type === 'debug'
					};
				},
				style: function () {
					return {
						'success': type === 'success',
						'info': type === 'info',
						'warning': type === 'warn',
						'danger': type === 'error'
					};
				},
				alertStyle: function () {
					return {
						'alert-success': type === 'success',
						'alert-info': type === 'info',
						'alert-warning': type === 'warn',
						'alert-danger': type === 'error'
					};
				},
				dismiss: function() {
					msg.dismissed = true;
				}
			};
			svc.messages.push(msg);

			if (msg.alert && svc.autoHide) {
				$timeout(function () {
					msg.alert = false;
				}, svc.autoHide);
			}

			if (svc.autoDismiss) {
				$timeout(function () {
					msg.dismissed = true;
				}, svc.autoDismiss);
			}
		};

		svc.success = function (txt, title) {
			$log.log(txt);
			add('success', txt, title, true);
		};

		svc.info = function (txt, title) {
			$log.info(txt);
			add('info', txt, title, true);
		};

		svc.warn = function (txt, title) {
			$log.warn(txt);
			add('warn', txt, title, true);
		};

		svc.error = function (txt, title) {
			$log.error(txt);
			add('error', txt, title, true);
		};

		svc.debug = function (txt, title) {
			$log.debug(txt);
			add('debug', txt, title, false);
		};

		svc.clear = function () {
			svc.messages.length = 0;
		};

		svc.last = function () {
			if (svc.messages.length === 0) { return false; }

			var msg = svc.messages[svc.messages.length - 1];
			return msg.dismissed ? false : msg;
		};

		svc.count = function() {
			var i, count = 0;
			for (i = 0; i < svc.messages.length; i+=1)
			{
				if (!svc.messages[i].dismissed) {
					count += 1;
				}
			}
			return count;
		};

		return svc;
	}];

	directive.msgDropdown = ['msgLogSvc', function (msg) {
		return {
			restrict: 'E',
			template:
				'<li class="dropdown" ng-show="msg.count()">' +
					'<a href="#" class="dropdown-toggle" data-toggle="dropdown">' +
					'<span class="badge">{{msg.count()}}</span> <i class="fa fa-exclamation"></i>' +
					'</a>' +
					'<div class="dropdown-menu" role="menu" style="width: 500px; max-height: 250px; overflow-y: scroll;">' +
					'<table class="table table-condensed"><tbody>' +
					'<tr ng-repeat="message in msg.messages" ng-class="message.style()" ng-hide="message.dismissed">' +
					'<td><i class="fa" ng-class="message.icon()"></i></td>' +
					'<td>{{message.txt}}</td>' +
					'<td><button type="button" class="close" aria-hidden="true" ng-click="message.dismiss()">&times;</button></td>' +
					'</tr></tbody>' +
					'</table>' +
					'</div>' +
					'</li>',
			replace: true,
			link: function (scope, element, attrs) {
				scope.msg = msg;
			}
		};
	}];

	directive.msgLastAlert = ['msgLogSvc', function (msg) {
		return {
			restrict: 'E',
			template:
				'<div ng-show="msg.last() && msg.last().alert && !msg.last().dismissed" class="alert alert-dismissable" ng-class="msg.last().alertStyle()">' +
					'<button type="button" class="close" aria-hidden="true" ng-click="msg.last().dismiss()">&times;</button>' +
					'<i class="fa fa-2x" ng-class="msg.last.icon()" style="float: left; padding-right: 10px;"></i>' +
					'<div><strong ng-show="msg.last().title">{{msg.last().title}}<br /></strong>{{msg.last().txt}}</div>' +
					'</div>',
			link: function (scope, element, attrs) {
				scope.msg = msg;
			}
		};
	}];

	directive.msgAlerts = ['msgLogSvc', function (msg) {
		return {
			restrict: 'E',
			template:
				'<div ng-repeat="m in msg.messages" ng-show="m.alert && !m.dismissed" class="alert alert-dismissable" ng-class="m.alertStyle()">' +
					'<button type="button" class="close" aria-hidden="true" ng-click="m.dismiss()">&times;</button>' +
					'<i class="fa fa-2x" ng-class="m.icon()" style="float: left; padding-right: 10px;"></i>' +
					'<div><strong ng-show="m.title">{{m.title}}<br /></strong>{{m.txt}}</div>' +
					'</div>',
			link: function (scope, element, attrs) {
				scope.msg = msg;
			}
		};
	}];

	return angular.module('msgLog', [], null)
		.directive(directive)
		.factory(factory);
});
// define the dependencies with requirejs
requirejs({
	baseUrl: 'js',
	waitSeconds: 0,

	paths: {
		'coffee-script': '/bower_components/coffee-script/extras/coffee-script',
		cs: '/bower_components/require-cs/cs',
        less: "/bower_components/require-less/less",
        lessc: "/bower_components/require-less/lessc",
        normalize: "/bower_components/require-less/normalize",
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
}, ['cs!bootstrap']);

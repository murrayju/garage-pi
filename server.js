var gpio = require("pi-gpio"),
    express = require('express'),
	q = require("q"),
    app = express();

// Define our pin names
var config = {
	door: [
		{
			trigger: 26,
			up: 3,
			down: 5
		},
		{
			trigger: 24,
			up: 7,
			down: 11
		}
	]
};

// Set up the io pins
var i;
var pins = [];
for (i=0; i<config.door.length; i++) {
	pins.push(gpio.open(config.door[i].trigger, "out"));
	pins.push(gpio.open(config.door[i].up, "in"));
	pins.push(gpio.open(config.door[i].down, "in"));
}

// Configure the web app
app.configure(function(){
	app.use(app.router);
	app.use(express.static(__dirname + '/www'));
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

// The api call to trigger door open/close
app.post('/api/trigger/:id', function (req, res) {
	var door = config.door[req.params.id];
	if (door) {
		console.log('Request to trigger door: ' + req.params.id);

		// Let's open the door
		return q.all(pins)
			.then(function () {
				return gpio.write(door.trigger, true);
			})
			.then(function () {
				var deferred = q.defer();

				// Press the button in for 1 second
				setTimeout(function () {
					deferred.resolve(
						gpio.write(door.trigger, false)
					);
				}, 1000);

				return deferred.promise;
			})
			.then(function () {
				// success
				return res.send({error: false});
			}, function (err) {
				return res.send({error: err || 'Unknown error'});
			});
	} else {
		var err = 'Tried to trigger invalid door: ' + req.params.id;
		console.log(err);
		return res.send({error: err}); 
	}
});

// The api call to get status feedback
app.get('/api/status', function (req, res) {
	var data = [];
	return q.all(pins)
		.then(function () {
			var promises = [];
			var i, door, d;
			for (i = 0; i < config.door.length; i++) {
				(function () {
					var door = config.door[i];
					data.push({});
					var d = data[i];
					promises.push(
						gpio.read(door.up)
							.then(function (val) {
								return d.up = !!val;
							}));
					promises.push(
						gpio.read(door.down)
							.then(function (val) {
								return d.down = !!val;
							}));
				})();
			}
			return q.all(promises).then(function() { return data; });
		})
		.then(function (d) {
			return res.send({error: false, data: data});
		}, function (err) {
			return res.send({error: err || 'Unkown error'});
		});
});

function cleanup () {
	console.log("Cleaning up...");
	var i;
	var pins = [];
	for (i=0; i<config.door.length; i++) {
		pins.push(gpio.close(config.door[i].trigger));
		pins.push(gpio.close(config.door[i].up));
		pins.push(gpio.close(config.door[i].down));
	}
	process.exit();
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

app.listen(80);

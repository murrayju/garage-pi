var gpio = require("pi-gpio"),
    express = require('express'),
	q = require("q"),
    app = express();

// Define our pin names
var config = {
	door: [
		{
			trigger: 24
		},
		{
			trigger: 26
		}
	]
};

// Set up the io pins
var i;
var pins = [];
for (i=0; i<config.door.length; i++) {
	pins.push(gpio.open(config.door[i].trigger, "out"));
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

function cleanup () {
	console.log("Cleaning up...");
	var i;
	var pins = [];
	for (i=0; i<config.door.length; i++) {
		pins.push(gpio.close(config.door[i].trigger));
	}
	process.exit();
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

app.listen(80);

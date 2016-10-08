var gpio = require("pi-gpio"),
	q = require("q"),
    express = require('express'),
    app = express(),
    server = require('http').Server(app),
    io = require('socket.io')(server);

var config = require('./config.json');

// Set up the io pins
var i;
var pins = [];
var status = [];
for (i=0; i<config.doors.length; i++) {
	pins.push(gpio.open(config.doors[i].pins.trigger, "out"));
	pins.push(gpio.open(config.doors[i].pins.up, "in"));
	pins.push(gpio.open(config.doors[i].pins.down, "in"));
    status.push({});
}

// Configure the web app
app.use(app.router);
app.use(express.static(__dirname + '/www'));
app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));

// The api call to trigger door open/close
app.post('/api/trigger/:id', function (req, res) {
	var door = config.doors[req.params.id];
	if (door) {
		console.log('Request to trigger door: ' + req.params.id);

		// Let's open the door
		return q.all(pins)
			.then(function () {
				return gpio.write(door.pins.trigger, true);
			})
			.then(function () {
				var deferred = q.defer();

				// Press the button in for 1 second
				setTimeout(function () {
					deferred.resolve(
						gpio.write(door.pins.trigger, false)
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
    return res.send(status);
});

// Share the config with the front end
app.get('/api/config', function (req, res) {
	return res.send(config);
});

io.on('connection', function (socket) {
    socket.emit('status', status);
});


// Monitor the input status
var statmon = setInterval(function () {
	q.all(pins)
		.then(function () {
            var i, promise, changed = false;
			for (i = 0; i < config.doors.length; i++) {
				(function (i) {
                    var door = config.doors[i];
                    var stat = status[i];

                    promise = q.when(promise, function () {
						return gpio.read(door.pins.up);
					}).then(function (val) {
                        var up = !!val;
                        if (up !== stat.up) {
                            changed = true;
                            var wasUp = stat.up;
                            stat.up = up;
                            if (!up && (wasUp === true)) {
                                stat.closing = true;
                            } else if (up) {
                                stat.opening = false;
                                stat.closing = false;
                            }
                        }
					}).then(function () {
						return gpio.read(door.pins.down);
					}).then(function (val) {
                        var down = !!val;
                        if (down !== stat.down) {
                            changed = true;
                            var wasDown = stat.down;
                            stat.down = down;
                            if (!down && (wasDown === true)) {
                                stat.opening = true;
                            } else {
                                stat.closing = false;
                                stat.opening = false;
                            }
                        }
					});
				})(i);
			}
			return promise.then(function() { 
                if (changed) {
                    io.emit('status', status);
                }
            });
		});

}, 250);

function cleanup () {
	console.log("Cleaning up...");
    clearInterval(statmon);
	var i;
	var pins = [];
	for (i=0; i<config.doors.length; i++) {
		pins.push(gpio.close(config.doors[i].pins.trigger));
		pins.push(gpio.close(config.doors[i].pins.up));
		pins.push(gpio.close(config.doors[i].pins.down));
	}
	q.all(pins).then(process.exit);
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

server.listen(80);

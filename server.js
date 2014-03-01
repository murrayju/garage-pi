var //gpio = require("pi-gpio"),
    express = require('express'),
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

app.configure(function(){
	app.use(app.router);
	app.use(express.static(__dirname + '/www'));
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.post('/api/trigger/:id', function (req, res) {
	var door = config.door[req.params.id];
	if (door) {
		console.log('Request to trigger door: ' + req.params.id);
		return res.send({error: false});
	} else {
		var err = 'Tried to trigger invalid door: ' + req.params.id;
		console.log(err);
		return res.send({error: err}); 
	}
});

app.listen(3000);

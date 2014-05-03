'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    passport = require('passport'),
    logger = require('mean-logger');

/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

// Initializing system variables
var config = require('./server/config/config');

var db = mongoose.connect('mongodb://otto:OTTOMIXER@novus.modulusmongo.net:27017/epOv4yqe');

// Bootstrap Models, Dependencies, Routes and the app as an express app
var app = require('./server/config/system/bootstrap')(passport, db);

var Drink = mongoose.model('Drink', {
	type : String,
	name : String,
	abv : Number,
	size : Number,
	solenoid : Number,
    carbonated : Boolean,
    refrigerated : Boolean,
    density : Number,
    fullness: Number
});

// api ---------------------------------------------------------------------
// get all drinks
app.get('/api/installedDrinks', function(req, res) {

	// use mongoose to get all drinks in the database
	Drink.find(function(err, installedDrinks) {

		// if there is an error retrieving, send the error. nothing after res.send(err) will execute
		if (err)
			res.send(err);

		res.json(installedDrinks); // return all drinks in JSON format
	});
});

//WE BASICALLY ONLY NEED GET AND UPDATE

// create drink and send back all drinks after creation
app.post('/api/installedDrinks', function(req, res) {
	// create a drink, information comes from AJAX request from Angular
	Drink.create({
		type : req.body.type,
		name : req.body.name,
		abv : req.body.abv,
		size : req.body.size,
		solenoid : req.body.solenoid,
	    carbonated : req.body.carbonated,
	    refrigerated : req.body.refrigerated,
	    density : req.body.density,
	    fullness: req.body.fullness
	}, function(err, drink) {
		if (err)
			res.send(err);

		// get and return all the drinks after you create another
		Drink.find(function(err, drinks) {
			if (err)
				res.send(err);
			res.json(drinks);
		});
	});
});

app.put('/api/installedDrinks/:solenoidIndex', function (req, res){
	Drink.findOneAndUpdate({solenoid:req.params.solenoidIndex},
		{
			name : req.body.name,
			carbonated : req.body.carbonated,
			fullness: req.body.fullness
		}, function(err, drink) {
		if (err)
			res.send(err);

		// get and return all the drinks after you create another
		Drink.find(function(err, drinks) {
			if (err)
				res.send(err);
			res.json(drinks);
		});
	});
});

// delete a drink
app.delete('/api/installedDrinks/:drink_id', function(req, res) {
	Drink.remove({
		_id : req.params.drink_id
	}, function(err, drink) {
		if (err)
			res.send(err);

		// get and return all the drinks after you create another
		Drink.find(function(err, drinks) {
			if (err)
				res.send(err);
			res.json(drinks);
		});
	});
});

// Start the app by listening on <port>
app.listen(config.port);
console.log('Mean app started on port ' + config.port + ' (' + process.env.NODE_ENV + ')');

// Initializing logger
logger.init(app, passport, mongoose);

// Expose app
exports = module.exports = app;

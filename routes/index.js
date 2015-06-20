/// <reference path="../typings/tsd.d.ts" />


// routing 
var routes = require('./root');
var admin = require('./admin');
var search = require('./search')

module.exports = function (app) {
	
	// push current session into response locals for jade
	app.use(function (req, res, next) {
		if (req.session) {
			res.locals.session = req.session;
		}
		next();
	});
	
	app.use('/admin', admin);
	app.use('/search', search);
	app.use('/', routes);

};

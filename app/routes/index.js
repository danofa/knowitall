/// <reference path="../typings/tsd.d.ts" />


// routing 
var root = require('./root');
var admin = require('./admin/');
var search = require('./search')

module.exports = function (app) {
	
	// push current session into response locals for jade
	app.use(function (req, res, next) {
		res.locals.ref = req.get('referrer');

		if (req.session) {
			res.locals.session = req.session;
		}
		next();
	});
	
	app.use('/admin/', admin);
	app.use('/search', search);
	app.use('/', root);

};

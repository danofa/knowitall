var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Articles = mongoose.model('Article');
var Topics = mongoose.model('Topic');


module.exports = function (router) { 
	router.get('/siteadmin', function(req, res, next){
		
	});
};
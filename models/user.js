/// <reference path="../typings/tsd.d.ts" />

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
	login: {type: String, required: true },
	password: {type: String, required: true },
	name: {type: String, required: true }
});

var User = mongoose.model('User', userSchema);
module.exports = User;
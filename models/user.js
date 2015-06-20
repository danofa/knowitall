/// <reference path="../typings/tsd.d.ts" />

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
	login: {type: String, required: true, unique: true },
	hash: {type: String, required: true },
	name: {type: String, required: true }
});

mongoose.model('User', userSchema);
//module.exports = User;
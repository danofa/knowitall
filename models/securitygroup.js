/// <reference path="../typings/tsd.d.ts" />

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var secgroupSchema = new mongoose.Schema({
});

mongoose.model('Securitygroup', secgroupSchema);

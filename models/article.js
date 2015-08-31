/// <reference path="../typings/tsd.d.ts" />

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new mongoose.Schema({
	user: { type: Schema.Types.ObjectId, required: '{PATH} is a required element!', ref: 'User' },
	body: { type: String },
	created: { type: Date, default: Date.now },
	modified: { type: Date, default: Date.now }
});

var articleSchema = new mongoose.Schema({
    title: { type: String, required: '{PATH} is a required element!' },
	body: { type: String, required: '{PATH} is a required element!' },
	quicklink: { type: String, unique: true, required: '{PATH} is a required element!' },
	created: { type: Date, default: Date.now },
	modified: { type: Date, default: Date.now },
	group: { type: Schema.Types.ObjectId, required: '{PATH} is a required element!', ref: 'Topic' },
	comments: { type: [commentSchema] }
});


articleSchema.index({title:"text", body:"text"});

mongoose.model('Article', articleSchema);

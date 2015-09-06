/// <reference path="../typings/tsd.d.ts" />

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new mongoose.Schema({
	userid: { type: Schema.Types.ObjectId, required: '{PATH} is a required element!', ref: 'User' },
	username: { type: String },
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
	comments: { type: [commentSchema] },
	createdby : { type: Schema.Types.ObjectId, ref: 'User' },
	lastmodifiedby:{ type: Schema.Types.ObjectId, ref: 'User' } 
});


articleSchema.index({title:"text", body:"text"});

mongoose.model('Comment', commentSchema);

mongoose.model('Article', articleSchema);

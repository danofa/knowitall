/// <reference path="../typings/tsd.d.ts" />

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var articleSchema = new mongoose.Schema({
    title: { type: String, required: '{PATH} is a required element!' },
	body: { type: String, required: '{PATH} is a required element!' },
	quicklink: { type: String, unique: true, required: '{PATH} is a required element!' },
	created: { type: Date, default: Date.now },
	modified: { type: Date, default: Date.now },
	group: { type: Schema.Types.ObjectId, required: '{PATH} is a required element!', ref: 'Topic' }
});

articleSchema.index({title:"text", body:"text"});

var topicSchema = new mongoose.Schema({
	title: { type: String, unique: true, required: '{PATH} is a required element!' },
	description: { type: String, required: '{PATH} is a required element!' },
	parent: { type: Schema.Types.ObjectId, default: null, ref: 'Topic'}
});

topicSchema.index({title : "text", description:"text"});

mongoose.model('Topic', topicSchema);
mongoose.model('Article', articleSchema);

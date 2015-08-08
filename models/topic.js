/// <reference path="../typings/tsd.d.ts" />

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var topicSchema = new mongoose.Schema({
	title: { type: String, unique: true, required: '{PATH} is a required element!' },
	description: { type: String, required: '{PATH} is a required element!' },
	parent: { type: Schema.Types.ObjectId, default: null, ref: 'Topic'}, 
	child_articles_count: {type: Number, default: 0 }
});

topicSchema.index({title : "text", description:"text"});

mongoose.model('Topic', topicSchema);

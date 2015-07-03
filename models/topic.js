/// <reference path="../typings/tsd.d.ts" />

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var topicSchema = new mongoose.Schema({
	title: { type: String, unique: true, required: '{PATH} is a required element!' },
	description: { type: String, required: '{PATH} is a required element!' },
	parent: { type: Schema.Types.ObjectId, default: null, ref: 'Topic'}, 
    children: [{type: Schema.Types.ObjectId, ref: 'Topic', default: null}]
});

topicSchema.index({title : "text", description:"text"});

mongoose.model('Topic', topicSchema);

topicSchema.pre('save', function(next){
   if(this.parent){
       mongoose.model('Topic').findByIdAndUpdate({_id: mongoose.Types.ObjectId(this.parent)}, {$addToSet: { children: this._id}}).exec();
   }
    next();
   });

topicSchema.pre('remove', function(next){
   if(this.parent){
       console.log('working on pull?');
       mongoose.model('Topic').findByIdAndUpdate({_id: mongoose.Types.ObjectId(this.parent)}, {$pull: { children: mongoose.Types.ObjectId(this._id)}}).exec();
   }
    next();
});


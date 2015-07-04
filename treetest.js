var mongoose = require('mongoose');
var topicModel = require("./models/topic.js");
var Topics = mongoose.model('Topic');

mongoose.connect('mongodb://127.0.0.1/knowitall', function (err) {
    if (err) {
        console.error("mongoose connection error: " + err);
        return;
    }
});
mongoose.set('debug', true);


Topics.find().populate('parent').exec(function (err, topics) {
    console.log('<ul>');
    topics.forEach(function (topic) {
        if (!topic.parent) {
            console.log('<li>');
            getChildren(topic, topics);
            console.log('</li>');
        }
    });
    console.log('</ul>');
});



function getChildren(topic, topics) {


    console.log('<ul><li>' + topic.title + '</li>');
    console.log('<li> + add another child</li>');

    topics.forEach(function (t) {

        if (t.parent && mongoose.Types.ObjectId(topic._id).equals(mongoose.Types.ObjectId(t.parent._id))) {
            console.log('<li>');
            getChildren(t, topics);
            console.log('</li>');
        }
    });
    console.log('</ul>');
}


//process.exit(0);
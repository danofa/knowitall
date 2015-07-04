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


    //    console.log('<ul><li>' + topic.title + '</li>');

    var subTopics = topics.filter(function (obj) {
        return (obj.parent && mongoose.Types.ObjectId(topic._id).equals(mongoose.Types.ObjectId(obj.parent._id)));
    });

    if (subTopics.length > 0) {
        console.log(topic.title + '<ul>');

        subTopics.forEach(function (t) {
            console.log('<li>');
            getChildren(t, topics);
            console.log('</li>');
        });
        
        console.log('</ul>');
        
    } else {
        console.log(topic.title);
    }


    /*
        topics.forEach(function (t) {

            if (t.parent && mongoose.Types.ObjectId(topic._id).equals(mongoose.Types.ObjectId(t.parent._id))) {
                console.log('<li>');
                getChildren(t, topics);
                console.log('</li>');
            }
        });
    */

    
}


//process.exit(0);
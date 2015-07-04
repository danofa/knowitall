/// <reference path="../../typings/tsd.d.ts" />

var mongoose = require('mongoose');
var Articles = mongoose.model('Article');
var Topics = mongoose.model('Topic');

module.exports = function (router) {
	router.get('/topic/add', function (req, res) {
		Topics.find(function (err, topics) {
			if (err) console.log(__filename + " : " + err);
			res.render('topic/add', { topicgroups: topics });
		});
	});

	// add new topic
	router.post('/topic/add', function (req, res, next) {
		var parent;

		if (!req.body.parent) {
			parent = null;
		} else {
			parent = mongoose.Types.ObjectId(req.body.parent);
		}

		var newTop = new Topics({
			title: req.body.title,
			description: req.body.description,
			parent: parent
		});

		newTop.save(function (err) {
			if (err) {
				res.render('topic/add', { add_error: err });
			} else {
				res.redirect("list");
			}
		});
	});

	// list topics
	router.get('/topic/list', function (req, res) {
		Topics.find().populate('parent').exec(function (err, topics) {
			if (err) console.log(__filename + " : " + err);

			res.render('topic/list', { topics: topics });
		});
	});

      
    
	// edit topic
	router.get('/topic/edit/:id', function (req, res) {
		Topics.findOne({ '_id': mongoose.Types.ObjectId(req.params.id) }).populate('parent').exec(function (err, topic) {
			if (err) return console.error(err);

			Topics.find(function (err, topics) {
				if (err) return console.error(err);
				res.render('topic/edit', { topic: topic, topicgroups: topics, edit_error: req.query.err });
			});
		});
	});

	// update topic
	router.post('/topic/update', function (req, res) {
		Topics.findOne({ '_id': mongoose.Types.ObjectId(req.body.id) }).exec(function (err, topic) {
			if (err) console.error(__filename + " : " + err);

			topic.title = req.body.title;
			topic.description = req.body.description;
			topic.parent = (req.body.parent ? mongoose.Types.ObjectId(req.body.parent) : null);

			topic.save(function (edit_err) {
				if (edit_err) {
					res.redirect("edit/" + topic._id + '?err=' + edit_err);
				} else {
					res.redirect("list");
				}
			});
		});
	});


	// delete topic
	router.get('/topic/delete/:id', function (req, res) {

		Topics.remove({ _id: mongoose.Types.ObjectId(req.params.id) }, function (err) {
			if (err) console.log(__filename + " : " + err);
			res.redirect("../list");
		});
	});
};
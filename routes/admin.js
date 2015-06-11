/// <reference path="../typings/tsd.d.ts" />

var express = require('express');
var router = express.Router();
var articleSchema = require("../models/article.js");
var mongoose = require('mongoose');
var Articles = mongoose.model('Article');
var Topics = mongoose.model('Topic');

router.all("*", function (req, res, next) {
  console.error("https://" + req.hostname + req.path);
  if (!req.secure) {
    res.redirect("https://" + req.hostname + req.path);
  } else {
    next();
  }
});

// admin index
router.get('/', function (req, res, next) {
  res.render('admin/index', {});
});

// add article
router.get('/article/add', function (req, res, next) {
  Topics.find(function (err, topics) {
    if (err) console.log(__filename + " : " + err);
    res.render('article/add', { topicgroups: topics });
  });
});

router.post('/article/add', function (req, res) {
  var newArt = new Articles({
    title: req.body.title,
    quicklink: req.body.quicklink.replace(/ /g, "-"),
    body: req.body.body,
    group: mongoose.Types.ObjectId(req.body.group)
  });

  newArt.save(function (err) {
    if (err) {
      res.render('article/add', { add_error: err });
    } else {
      res.redirect("list");
    }
  });
});

// list aricles
router.get('/article/list', function (req, res) {
  Articles
    .find()
    .populate('group')
    .exec(function (err, articles) {
    if (err) console.log(__filename + " : " + err);
    res.render('article/list', { articles: articles });
  });
});

// edit articles
router.get('/article/edit/:id', function (req, res) {
  Articles
    .findOne({ '_id': mongoose.Types.ObjectId(req.params.id) })
    .populate('group')
    .exec(function (err, article) {
    if (err) return console.error(err);
    Topics.find(function (err, topics) {
      if (err) console.log(__filename + " : " + err);
      res.render('article/edit', { art: article, topicgroups: topics, edit_error: req.query.err });
    });
  });
});

router.post('/article/update', function (req, res) {
  Articles.findOne({ '_id': mongoose.Types.ObjectId(req.body.id) }).populate('group').exec(function (err, article) {
    article.title = req.body.title;
    article.quicklink = req.body.quicklink.replace(/ /g, "-");
    article.body = req.body.body;
    article.modified = new Date;
    article.group = mongoose.Types.ObjectId(req.body.group);

    article.save(function (edit_err) {
      if (edit_err) {
        if (err) console.log(__filename + " : " + err);

        res.redirect("edit/" + article._id + '?err=' + edit_err);

      } else {
        res.redirect("list");
      }
    });
  });
});


// delete article
router.get('/article/delete/:id', function (req, res) {
  Articles.remove({ _id: mongoose.Types.ObjectId(req.params.id) }, function (err) {
    if (err) console.log(__filename + " : " + err);
    res.redirect("../list");
  });
})

//topic routing

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

    console.log("parent is: " + topic.parent);
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


module.exports = router;

/// <reference path="../../typings/tsd.d.ts" />

var mongoose = require('mongoose');
var Articles = mongoose.model('Article');
var Topics = mongoose.model('Topic');

module.exports = function (router) {
  
    // preview article
    router.get('/article/preview', function (req, res, next) {
        res.render('article/preview');
    });

    // add article
    router.get('/article/add', function (req, res, next) {
        Topics.find(function (err, topics) {
      if (err) console.error(__filename + " : " + err);
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
      if (err) console.error(__filename + " : " + err);

      article.title = req.body.title;
      article.quicklink = req.body.quicklink.replace(/ /g, "-");
      article.body = req.body.body;
      article.modified = new Date;
      article.group = mongoose.Types.ObjectId(req.body.group);

      article.save(function (edit_err) {
        if (edit_err) {
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
    });
};
/// <reference path="../../typings/tsd.d.ts" />

var mongoose = require('mongoose');
var Articles = mongoose.model('Article');
var Topics = mongoose.model('Topic');
var Utils = require('../../utils.js');
var Comments = mongoose.model('Comment');

module.exports = function (router) {
  
    // preview article
    router.get('/article/preview', function (req, res, next) {
        res.render('article/preview');
    });

    router.post('/article/comment', function (req, res) {
        var sess = req.session;
        
        Articles.findOne({ _id: new mongoose.Types.ObjectId(req.body.article) }).exec(function (err, article) {
            var newComment = new Comments({
                userid: new mongoose.Types.ObjectId(sess.uid),
                username: sess.displayname,
                body: req.body.body,
                created: new Date(),
                modified: new Date()
            });

            article.comments.push(newComment);
            article.comments.sort(function (a, b) {
                return b.modified.getTime() - a.modified.getTime();
            });
            
            article.save(function (err) {
                if (err) {
                    console.error(__filename + " : " + err);
                    var errObj = {
                        err: err,
                        success: false
                    };

                    res.send(errObj);
                    
                } else {
                    var resObj = {
                        success: true,
                        comment: newComment                        
                    };
                    res.send(resObj);
                }
            });
        });
    });

    // add article
    router.get('/article/add', function (req, res, next) {
        Topics.find(function (err, topics) {
            if (err) console.error(__filename + " : " + err);
            res.render('article/add', { topicgroups: topics, tid: req.query.tid, ref: res.locals.ref });
        });
    });


    router.post('/article/add', function (req, res) {
        

        console.log(req.body.group);
        var topicId = new mongoose.Types.ObjectId(req.body.group);

        var newArt = new Articles({
            title: req.body.title,
            quicklink: req.body.quicklink.replace(/ /g, "-"),
            body: req.body.body,
            group: topicId,
            createdby: req.session.uid,
            lastmodfiedby: req.session.uid
        });

        newArt.save(function (err) {
            if (err) {
                 if (err) console.error(__filename + " : " + err);
                res.render('article/add', { add_error: err });
            } else {
                Utils.incrementAritclesCount(topicId, function (err) {
                    if (err) console.error(__filename + " : " + err);
                    console.log('inref: ' + res.locals.ref);
                    if (req.body.refurl) {
                        res.redirect(req.body.refurl);
                    } else {
                        res.redirect("list");
                    }
                })
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
            .findOne({ '_id': new mongoose.Types.ObjectId(req.params.id) })
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
        Articles.findOne({ '_id': new mongoose.Types.ObjectId(req.body.id) }).populate('group').exec(function (err, article) {
            if (err) console.error(__filename + " : " + err);

            article.title = req.body.title;
            article.quicklink = req.body.quicklink.replace(/ /g, "-");
            article.body = req.body.body;
            article.modified = new Date;
            article.group = new mongoose.Types.ObjectId(req.body.group);
            article.lastmodifiedby = req.session.uid;
            

                article.save(function (edit_err) {
                    if (edit_err) {
                        res.redirect('edit/' + article._id + '?err=' + edit_err);
                    } else {
                        Utils.calculateAritcleCounts(function () {
                            res.redirect("list");
                        });
                    }
                });
        });
    });


    // delete article
    router.get('/article/delete/:id', function (req, res) {
        Articles.remove({ _id: new mongoose.Types.ObjectId(req.params.id) }, function (err) {
            if (err) console.log(__filename + " : " + err);
            Utils.calculateAritcleCounts(function () {
                res.redirect("../list");
            });
        });
    });
};
/// <reference path="../typings/tsd.d.ts" />

var express = require('express');
var router = express.Router();
var Topics = require('mongoose').model('Topic');
var Articles = require('mongoose').model('Article');
var url = require('url');

// website index
router.get('/', function (req, res, next) {
    Topics.find({ parent: null }, function (err, topics) {
        if (err) console.error(__filename + " : " + err);
        res.render('index', { topics: topics });
    });
});

// login page
router.get('/login', function (req, res, next) {
    if (req.secure) {
        res.render('login');
    } else {
        res.redirect("https://" + req.hostname + req.path);
    }
});

router.post('/login', function (req, res, next) {
    if (req.secure) {
        res.redirect('/admin');
    } else {
        res.redirect("https://" + req.hostname + req.path);
    }
});

// traversing topics
router.get('/*', function (req, res, next) {
    var data = decodeURI(req.path.replace(/^\/|\/$/g, '')).split("/");

    Topics.findOne({ title: data[data.length - 1] }, function (err, parent) {
        if (err) console.error(__filename + " : " + err);

        if (parent === null) {
            res.render('index', { topics: null });
        } else {
            Topics.find({ parent: parent._id }, function (err, topics) {
                if (err) console.error(__filename + " : " + err);
                Articles.find({ group: parent._id }).exec(function (err, articles) {
                    res.render('index', { groupval: parent, topics: topics, articles: articles, breadcrumbs: data });
                });
            });
        }
    });
});

module.exports = router;
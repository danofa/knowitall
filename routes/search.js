/// <reference path="../typings/tsd.d.ts" />

var router = require('express').Router();
var Topics = require('mongoose').model('Topic');
var Articles = require('mongoose').model('Article');
var url = require('url');

// search index
router.post('/', function (req, res, next) {
    var searchterms = '\"' + req.body.search.split(" ").join('\" \"') + '\"';

    // if search is blank, just throw everything from db back.
    if (typeof (req.body.search) === 'undefined' || req.body.search.length == 0) {
        next();

    } else {
        Topics.find({ $text: { $search: searchterms } }, function (err, topics) {
            if (err) console.error(__filename + " : " + err);
            
            Articles.find({ $text: { $search: searchterms } }).populate('group').exec(function (err, articles) {
                if (err) console.log(__filename + " : " + err);

                if (typeof (articles) === 'undefined')
                    articles = [];

                  res.render('index', { topics: topics, articles: articles, search: req.body.search, searchcount: topics.length + articles.length });
            });
        });
    }
}, function (req, res) {
        Topics.find(function (err, topics) {

            if (err) console.log(__filename + " : " + err);

            Articles.find().populate('group').exec(function (err, articles) {
                if (err) console.log(__filename + " : " + err);

                if (typeof (articles) === 'undefined')
                    articles = [];

                var gv = {};
                gv.title = "none";
                res.render('index', { topics: topics, articles: articles, search: req.body.search, searchcount: topics.length + articles.length });
            });
        });
    });

module.exports = router;
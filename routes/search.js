/// <reference path="../typings/tsd.d.ts" />

var express = require('express');
var router = express.Router();
var Topics = require('mongoose').model('Topic');
var Articles = require('mongoose').model('Article');
var url = require('url');

// search index
router.post('/', function (req, res, next) {
    var searchterms = '\"' + req.body.search.split(" ").join('\" \"') + '\"';

    if (typeof (req.body.search) === 'undefined' || req.body.search.length == 0) {
        next();
    } else {
        Topics.find({ $text: { $search: searchterms } }, function (err, topics) {

            if (err) console.log(__filename + " : " + err);

            Articles.find({ $text: { $search: searchterms } }).populate('group').exec(function (err, articles) {
                if (err) console.log(__filename + " : " + err);

                if (typeof (articles) === 'undefined')
                    articles = [];

                topics = getRows(topics);
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

                topics = getRows(topics);
                res.render('index', { topics: topics, articles: articles, search: req.body.search, searchcount: topics.length + articles.length });
            });
        });
    });

function getRows(items) {
    if (typeof (items) === 'undefined')
        return [];

    return items.reduce(function (prev, item, i) {
        if (i % 4 === 0)
            prev.push([item]);
        else
            prev[prev.length - 1].push(item);
        return prev;
    }, []);
}

module.exports = router;
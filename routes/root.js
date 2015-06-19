/// <reference path="../typings/tsd.d.ts" />

var express = require('express');
var router = express.Router();
var Topics = require('mongoose').model('Topic');
var Articles = require('mongoose').model('Article');
var url = require('url');
var bcrypt = require('bcryptjs');
var Users = require('mongoose').model('User');

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
        if (req.session.authenticated == true) {
            res.redirect('/admin');
        } else {
            res.render('login');
        }

    } else {
        res.redirect("https://" + req.hostname + req.path);
    }
});

// logout !
router.get('/logout', function (req, res, next) {
    if (req.secure && req.session.authenticated) {
        req.session.destroy();
        res.redirect('/');
    } else {
        next();
    }
});

// check login credentials, turn away if failed!
router.post('/login', function (req, res, next) {
    if (req.secure && req.body.login && req.body.password) {

        var sess = req.session;
        Users.findOne({ login: req.body.login }, function (err, user) {
            if (err) console.error(__filename + " : " + err);

            if (user && typeof user !== 'undefined' && bcrypt.compareSync(req.body.password, user.hash)) {
                sess.authenticated = true;
                sess.displayname = user.name;
                sess.login = user.login;
                res.redirect('/admin');
            } else {
                res.status(401).send('Invalid credentials');
            }
        });

    } else {
        res.status(401).send('Invalid credentials');
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
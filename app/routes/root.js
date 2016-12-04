/// <reference path="../typings/tsd.d.ts" />

var router = require('express').Router();
var Topics = require('mongoose').model('Topic');
var Articles = require('mongoose').model('Article');
var Users = require('mongoose').model('User');

var url = require('url');
var bcrypt = require('bcryptjs');

// website index
router.get('/', function (req, res, next) {
    Topics.find({ parent: null }, function (err, topics) {
        if (err) console.error(__filename + " : " + err);
        
        // find last 10 articles modified
        Articles.find().sort({ modified: -1 }).limit(10).populate('group').exec(function (err, articles) {
            if(err) console.error(__filename + " : " + err);
            
            res.render('index', { topics: topics, lastten: true, articles: articles });
        });
    }).sort({ title: 1 });
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
        Users.findOne({ login: req.body.login }).populate('secgroups').exec(function (err, user) {
            if (err) console.error(__filename + " : " + err);

            if (user && typeof user !== 'undefined' && bcrypt.compareSync(req.body.password, user.hash)) {
                sess.authenticated = true;
                sess.secgroups = user.secgroups;
                sess.displayname = user.name;
                sess.login = user.login;
                sess.uid = user._id;
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

                Articles.find({ group: parent._id }).sort({ title: 1 }).exec(function (err, articles) {
                    res.render('index', { groupval: parent, topics: topics, articles: articles, breadcrumbs: data });
                });
            }).sort({ title: 1 });
        }
    });
});

module.exports = router;
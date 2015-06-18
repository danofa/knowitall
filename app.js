/// <reference path="typings/tsd.d.ts"/>

/*
 Copyright 2015 Dion Mitchell

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

*/

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

// model
var articleModel = require("./models/article.js");

// routing 
var routes = require('./routes/root');
var admin = require('./routes/admin');
var search = require('./routes/search')

var app = express();

// db setup
mongoose.connect('mongodb://127.0.0.1/testknowit', function (err) { if (err) { console.error("mongoose connection error: " + err); return; } });
mongoose.set('debug', true);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('view options', { pretty: true });
app.locals.pretty = true;

// date formatting lib in global scope.
app.locals.moment = require('moment');

//markdown parser in global scope
app.locals.md = require('marked');

// session store setup
app.set('trust proxy', 1);
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: 'mysuper app secret',
  cookie : { secure: true, httpOnly: false, maxAge: 60000 },
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

// middleware setup
app.use(favicon(__dirname + '/public/images/fav.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.disable("x-powered-by");

app.use('/admin', admin);
app.use('/search', search);
app.use('/', routes);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;

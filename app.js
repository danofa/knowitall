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
var middleware = require('./middleware')
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var logging = require('./logging');

// model
var articleModel = require("./models/article.js");
var topicModel = require("./models/topic.js");
var userModel = require("./models/user.js");

// routing 
var routes = require('./routes/index');

// express setup
var app = express();

// title of app here changes window title and 'Brand' shortcut on actual page.
app.locals.apptitle = 'Knowitall';

// db setup
mongoose.connect('mongodb://127.0.0.1/knowitall', function (err) { if (err) { console.error("mongoose connection error: " + err); return; } });
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
  cookie : { secure: true, httpOnly: true, maxAge: (1000 * 60 * 60) },
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

middleware(app);

routes(app);

logging(app);

module.exports = app;

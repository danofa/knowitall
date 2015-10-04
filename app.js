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
var fs = require('fs');

// model auto loader
var model_path = path.join(__dirname, 'models');
var models = fs.readdirSync(model_path).forEach(function (model) {
  require(path.join(model_path, model));
});

// routing 
var routes = require('./routes/index');

// express setup
var app = express();

// title of app here changes window title and 'Brand' shortcut on actual page.
app.locals.apptitle = 'Knowitall';

// db setup
mongoose.connect('mongodb://127.0.0.1/knowitall', function (err) { if (err) { console.error("mongoose connection error: " + err); process.exit(); } });
mongoose.set('debug', true);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('view options', { pretty: true });
app.locals.pretty = true;

// date formatting lib in global scope.
app.locals.moment = require('moment');

app.locals.moment.locale('fr', {
  months: "janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre".split("_"),
  monthsShort: "janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.".split("_"),
  weekdays: "dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi".split("_"),
  weekdaysShort: "dim._lun._mar._mer._jeu._ven._sam.".split("_"),
  weekdaysMin: "Di_Lu_Ma_Me_Je_Ve_Sa".split("_"),
  longDateFormat: {
    LT: "HH:mm",
    LTS: "HH:mm:ss",
    L: "DD/MM/YYYY",
    LL: "D MMMM YYYY",
    LLL: "D MMMM YYYY LT",
    LLLL: "dddd D MMMM YYYY LT"
  },
  calendar: {
    sameDay: "[Aujourd'hui à] LT",
    nextDay: '[Demain à] LT',
    nextWeek: 'dddd [à] LT',
    lastDay: '[Hier à] LT',
    lastWeek: 'dddd [dernier à] LT',
    sameElse: 'L'
  },
  relativeTime: {
    future: "dans %s",
    past: "il y a %s",
    s: "quelques secondes",
    m: "une minute",
    mm: "%d minutes",
    h: "une heure",
    hh: "%d heures",
    d: "un jour",
    dd: "%d jours",
    M: "un mois",
    MM: "%d mois",
    y: "une année",
    yy: "%d années"
  },
  ordinalParse: /\d{1,2}(er|ème)/,
  ordinal: function (number) {
    return number + (number === 1 ? 'er' : 'ème');
  },
  meridiemParse: /PD|MD/,
  isPM: function (input) {
    return input.charAt(0) === 'M';
  },
  // in case the meridiem units are not separated around 12, then implement
  // this function (look at locale/id.js for an example)
  // meridiemHour : function (hour, meridiem) {
  //     return /* 0-23 hour, given meridiem token and hour 1-12 */
  // },
  meridiem: function (hours, minutes, isLower) {
    return hours < 12 ? 'PD' : 'MD';
  },
  week: {
    dow: 1, // Monday is the first day of the week.
    doy: 4  // The week that contains Jan 4th is the first week of the year.
  }
});


//markdown parser in global scope
app.locals.md = require('marked');

// session store setup
app.set('trust proxy', 1);

app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: 'mysuper app secret',
  cookie: { secure: true, httpOnly: true, maxAge: (1000 * 60 * 60) },
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

middleware(app);

routes(app);

logging(app);

module.exports = app;

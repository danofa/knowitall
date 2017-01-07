var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Articles = mongoose.model('Article');
var Topics = mongoose.model('Topic');

// catchall for checking https is being used, and for checking user is logged in
router.all("*", function (req, res, next) {
    var sess = req.session;
    
    if (sess.authenticated != true) {
      console.log(req.session);
      console.log("failing here!!");
      res.status(401).send('Invalid credentials');

    } else {
      sess.touch();
      next();
    }
});

// admin index
router.get('/', function (req, res, next) {
  res.render('admin/index', {secgroups: req.session.secgroups, perms: req.session.perms});
});

require('./article.js')(router);

require('./topic.js')(router);

require('./site_admin.js')(router);

router.use(function(req,res,next){
  res.sendStatus(404);  
});

module.exports = router;

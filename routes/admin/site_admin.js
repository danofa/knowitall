var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Users = mongoose.model('User');
var Secgroups = mongoose.model('Securitygroup');
var bcrypt = require('bcryptjs')

module.exports = function (router) {
	router.get('/siteadmin', function (req, res, next) {

		Users.find(function (err, users) {
			if (err) console.log(__filename + err);

			Secgroups.find(function (err, secgroups) {
				if (err) console.log(__filename + err)
				res.render('admin/site_admin/index', { users: users, secgroups: secgroups });
			});
		});
	});

	router.get('/siteadmin/editgroup', function (req, res, next) {
		res.render('admin/site_admin/edit_groups');
	});

	router.get('/siteadmin/edituser', function (req, res, next) {
		Users.findOne({ _id: req.query.uid }, { hash: 0 }).exec(function (err, user) {
			if (err) console.error(__filename + err);
			res.render('admin/site_admin/edit_users', { user: user });
		});
	});

	router.get('/siteadmin/adduser', function (req, res, next) {
		res.render('admin/site_admin/add_user');
	});

	/* update user password in db, create a new hash */
	router.post('/siteadmin/updateuserpass', function (req, res, next) {
		if (req.body.updatepass) {
			var salt = bcrypt.genSaltSync(10);
			var hash = bcrypt.hashSync(req.body.newp, salt);

			var result = { msg: "" };

			Users.findOne({ _id: mongoose.Types.ObjectId(req.body.uid) }, function (err, user) {
				if (err) {
					console.error(__filename + " : " + err);
					result.msg += err;
					res.send(result);

				} else {
					user.hash = hash;
					user.save(function (err, succ) {
						if (err) result.msg += err;
						else {
							result.success = true;
							result.msg += "Password updated!";
						}

						res.send(result);

					});
				}
			});
		}
	});
	
	
	// update user details ( login, name )
	router.post('/siteadmin/updateuser', function (req, res, next) {
		var result = { msg: "" }

		if (req.body.updateuser) {
			Users.findOne({ _id: mongoose.Types.ObjectId(req.body.uid) }, function (err, user) {
				if (err) {
					console.error(__filename + " : " + err);
					result.msg += err;
					res.send(result);

				} else {
					user.login = req.body.login;
					user.name = req.body.name;

					user.save(function (err, succ) {
						if (err) result.msg += err;
						else {
							result.success = true;
							result.msg += "User details updated!";
						}

						res.send(result);

					});
				}
			});
		}
	});

	// add user 
	router.post('/siteadmin/adduser', function (req, res, next) {
		var newUser = {
			login: req.body.login,
			name: req.body.name,
			hash: getHash(req.body.pass)
		}

		var result = { msg: "" };

		Users.create(newUser, function (err, user) {
			if (err) {
				console.error(__filename + " : " + err);
				result.msg += err;
			} else {
				result.msg += "User added!"
			}
			res.send(result);
		});
	});

	// delete user
	router.get('/siteadmin/deluser', function (req, res, next) {

		var result = { msg: "" };

		Users.findOneAndRemove({ _id: mongoose.Types.ObjectId(req.query.uid) }, function (err) {
			if (err) {
				console.error(__filename + " : " + err);
				result.msg += err;
			} else {
				result.msg += "User deleted!";
			}
			res.redirect('/admin/siteadmin');
		})
	});




	/* general util functions */
	function getHash(password) {
		return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
	}


};
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

	router.get('/siteadmin/addsecgroup', function (req, res, next) {
		res.render('admin/site_admin/add_group', { secgroup: new Secgroups });
	});

	router.get('/siteadmin/edituser', function (req, res, next) {
		Users.findOne({ _id: req.query.uid }, { hash: 0 })
		//			.populate('secgroups')
			.exec(function (err, user) {
				if (err) console.error(__filename + err);
				res.render('admin/site_admin/edit_users', { user: user });
			});
	});

	router.get('/siteadmin/adduser', function (req, res, next) {
		res.render('admin/site_admin/add_user');
	});

	// route.post('/siteadmin/addsecgroup', (req, res, next) => {

	// });

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
							result.msg += "User details updated! (changes visible at next login)";
						}

						res.send(result);

					});
				}
			});
		}
	});
	// add user 
	router.post('/siteadmin/adduser', function (req, res, next) {
		var newSecGroup = new Secgroups;
		var result = { msg: "" };

		var newUser = {
			login: req.body.login,
			name: req.body.name,
			hash: getHash(req.body.pass)
		};

		newSecGroup.name = newUser.login;
		newSecGroup.description = "default security group for user: " + newUser.login + " / " + newUser.name;

		newUser.secgroups = [newSecGroup._id];
		Users.create(newUser, function (err, user) {
			if (err) {
				console.error(__filename + " : " + err);
				result.msg += err;
			} else {
				result.msg += "User added! "

				newSecGroup.save(function (err) {
					if (err) console.err("error in default user security group creation: " + err);
				});

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

	// edit security group
	router.get('/siteadmin/editsecgroup', function (req, res, next) {
		Secgroups.findOne({ _id: mongoose.Types.ObjectId(req.query.gid) }, function (err, secgroup) {
			res.render('admin/site_admin/edit_groups', { secgroup: secgroup });
		});
	});


	// update security group
	router.post('/siteadmin/updatesecgroup', function (req, res, next) {
		Secgroups.findOne({ _id: mongoose.Types.ObjectId(req.body.gid) }, function (err, secgroup) {
			if (err) console.err("err in update of security group : " + err);
			else {
				for (var k in req.body) {
					secgroup.permissions[k] = req.body[k];
				}
				secgroup.name = req.body.groupname;
				secgroup.description = req.body.groupdescription;

				secgroup.save(function (err) {
					if (err) console.error("error on save of security group" + err);
					else {
						res.send({msg:"group updated!"});
					}
				});
			}
		});
	});
	
	
	// delete security group
	router.get('/siteadmin/delsecgroup', function (req, res, next) {

		var result = { msg: "" };

		Secgroups.findOneAndRemove({ _id: mongoose.Types.ObjectId(req.query.gid) }, function (err) {
			if (err) {
				console.error(__filename + " : " + err);
				result.msg += err;
			} else {
				result.msg += "Security group deleted!";
			}
			res.redirect('/admin/siteadmin');
		});
	});


	/* general util functions */
	function getHash(password) {
		return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
	}
};
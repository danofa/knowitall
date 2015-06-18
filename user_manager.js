/// <reference path="typings/tsd.d.ts" />

var mongoose = require('mongoose');
var bcrypt = require('bcryptjs')
var inquirer = require("inquirer");

var Users = require('./models/user.js');

mongoose.connect('mongodb://127.0.0.1/testknowit', function (err) { if (err) { console.error("mongoose connection error: " + err); return; } });
//mongoose.set('debug', true);

function main() {
	inquirer.prompt([{
		type: "rawlist",
		name: "usermenu",
		message: "select user operation",
		choices: [
			{ name: "list users", value: 1 },
			{ name: "add user", value: 2 },
			{ name: "delete user", value: 3 },
			{ name: "edit user", value: 4 },
			{ name: "quit", value: 5 }

		]
	}],
		function (answers) {
			switch (answers.usermenu) {
				case 1:
					Users.find(function (err, users) {
						console.log("\r\nUsers: ");
						users.forEach(function (user) { console.log("- Display name: " + user.name + ", Login: " + user.login); });
						console.log(users.length + " users found.\r\n");
						main();
					});
					break;

				case 2:
					adduser();
					break;

				case 3:
					console.log("del user function");
					break;

				case 4:
					console.log("edit user function");
					break;

				case 5:
					quit();

				default:
					quit();
					break;
			}

		});
}

function adduser() {
	inquirer.prompt([
		{ type: "input", name: "login", message: "enter login name" },
		{ type: "password", name: "pass", message: "enter password" },
		{ type: "password", name: "confirmpass", message: "confirm password" },
		{ type: "input", name: "realname", message: "enter display name" }],
		function (answers) {
			if (answers.pass !== answers.confirmpass) {
				console.error("passwords do not match");
				adduser();

			} else {
				var salt = bcrypt.genSaltSync(10);
				var hash = bcrypt.hashSync(answers.pass, salt);

				var user = new Users({
					login: answers.login,
					password: hash,
					salt: salt,
					name: answers.realname
				});

				user.save(function (err) {
					if (err) {
						console.error("could not save new user: " + err);
						main();
					} else {
						console.log(answers.realname + " successfully added.");
						main();
					}
				});
			}
		});
}

function deluser(){
	
}

function edituser(){
	
}

function quit() {
	process.exit();
}

main();
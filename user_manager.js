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
					console.log("Users: ");
					Users.find(function (err, users) {
						users.forEach(function (user) { console.log("found: " + user.name); });
						console.log(users.length + " users found.");
					});
					main();
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
					process.exit();
					
				default:
					process.exit();
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
			if(answers.pass !== answers.confirmpass){
				console.error("passwords do not match");
				adduser();
			}
		});
}


main();
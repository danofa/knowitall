/// <reference path="typings/tsd.d.ts" />

var mongoose = require('mongoose');
var bcrypt = require('bcryptjs')
var inquirer = require("inquirer");

var Users = require('./models/user.js');

mongoose.connect('mongodb://127.0.0.1/testknowit', function (err) { if (err) { console.error("mongoose connection error: " + err); return; } });
mongoose.set('debug', true);

Users.find(function (err, users) {
	users.forEach(function (user) { console.log("found: " + user.name); });
});

function main() {
	inquirer.prompt([{
		type: "list",
		name: "usermenu",
		message: "select user operation",
		choices: [
			{ name: "list users", value: 1 },
			{ name: "add user", value: 2 },
			{ name: "delete user", value: 3 },
			{ name: "edit user", value: 4 }
		]
	}],
		function (answers) {
			console.log(JSON.stringify(answers, null, "  "));



			main();
		});
}

main();
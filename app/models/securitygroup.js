/// <reference path="../typings/tsd.d.ts" />

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var secgroupSchema = new mongoose.Schema({
	name: { type: String },
	description: { type: String },

	permissions: {
		can_adduser: { type: Boolean, default: false },
		can_deluser: { type: Boolean, default: false },
		can_edituser: { type: Boolean, default: false },

		can_addsecuritygroup: { type: Boolean, default: false },
		can_delsecuritygroup: { type: Boolean, default: false },
		can_editsecuritygroup: { type: Boolean, default: false },

		can_addarticle: { type: Boolean, default: false },
		can_editarticle: { type: Boolean, default: false },
		can_delarticle: { type: Boolean, default: false },

		can_addtopic: { type: Boolean, default: false },
		can_edittopic: { type: Boolean, default: false },
		can_deltopic: { type: Boolean, default: false }
	}

});

mongoose.model('Securitygroup', secgroupSchema);

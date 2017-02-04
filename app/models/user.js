var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//var Secgroups = mongoose.model('Securitygroup');

var userSchema = new Schema({
	login: {type: String, required: true, unique: true },
	hash: {type: String, required: true },
	name: {type: String, required: true },
	//secgroups: { type: [Schema.Types.ObjectId], default: new Secgroups, ref: 'Securitygroup'}
});

mongoose.model('User', userSchema);

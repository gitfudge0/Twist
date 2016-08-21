var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var testSchema = new Schema({
	name: String,
	title: String,
	company: String
});

var userSchema = new Schema({
	userid: String,
	name: String,
	email: String,
	password: String,
	acctype: String,
	lastip: String
});

var postSchema = new Schema({
	postid: String,
	userid: String,
	date: Date,
	title: String,
	shortdesc: String,
	content: [{
		sectionid: String,
		title: String,
		desc: String,
		body: String
	}],
	comments: [{
		user: String,
		date: Date,
		body: String,
	}],
	connections: [{
		sectionid: String,
		connectedto: String
	}]
});

mongoose.model('test', testSchema);
mongoose.model('users', userSchema);
mongoose.model('posts', postSchema);
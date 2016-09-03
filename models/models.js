var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var testSchema = new Schema({
	name: String,
	title: String,
	company: String
});

var userSchema = new Schema({
	userid: String,
	password: String,
	facebook: {
		id: String,
		token: String,
		email: String,
		name: String
	}
});

var postSchema = new Schema({
	postid: String,
	userid: String,
	date: {type: Date, default: Date.now},
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
		date: {type: Date, default: Date.now},
		body: String,
	}]
});

var connectSchema = new Schema({
	sectionid: String,
	connectedto: String
});

mongoose.model('test', testSchema);
mongoose.model('users', userSchema);
mongoose.model('posts', postSchema);
mongoose.model('connection', connectSchema);
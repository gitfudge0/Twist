var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('users');
var Test = mongoose.model('test');
var Posts = mongoose.model('posts');
var Connections = mongoose.model('connection');


router.post('/test', function(req, res) {
	Test.find(function(err, test) {
		if (err) {
			return res.send(500, err);
		} else {
			console.log('Find function');
			console.log(test);
			return res.status(200).send(test);
		}
	});
	console.log('Value obtained from Angular: ' + req.body.val);
});


router.post('/save', function(req, res) {

	if (req.body.part == 'intro') {
		
		var post = new Posts();
		post.postid = req.body.postid;
		post.userid = req.body.userid;
		post.title = req.body.title;
		post.shortdesc = req.body.desc;

		post.save(function(err, resval) {
			if (err) {
				console.log(err);
			}
			console.log(resval);
		});

		console.log('Intro title: ' + req.body.title);
		console.log('Intro desc: ' + req.body.desc);
	} else if (req.body.part == 'content') {

		Posts.update({
				postid: req.body.postid
			}, 
			{
				$push: { 
					content: {
						sectionid: req.body.val.section_id,
						title: req.body.val.title,
						desc: req.body.val.desc,
						body: req.body.val.body
					} 
				}
			}, 
			function(err, updated) {
				if (err || !updated) {
					console.log(err);
				} else {
					console.log(updated);
				}
			
		});
		var connect = new Connections();
		connect.sectionid = req.body.val.section_id;
		connect.connectedto = req.body.val.connected_to;

		connect.save(function(err, saved) {
			if (err) {
				console.log(err);
			}
			console.log(saved);
		})
		
		console.log(req.body.val);
	} else {
		console.log('No data Received');
	}
	return res.status(200).send('Received Data');
});


router.post('/list', function(req, res) {
	Posts.find(function(err, data) {
		if (err) {
			return res.send(err);
		} else {
			return res.send(data);
		}
	})
});


router.post('/post', function(req, res) {
	if(req.body.type == 'main') {
		Posts.find({postid: req.body.postid}, function(err, post) {
			if (err) {
				return res.send(err);
			}
			return res.send(post);
		})	
	}
	if (req.body.type == 'getsection') {
		Connections.find({
			connectedto: req.body.sectionid
		}, function(err, data) {
			if (err) {
				return res.send(err);
			}
			return res.send(data);
		});
	}
	if (req.body.type == 'getcontent') {
		Posts.find({
			"content.sectionid": req.body.sectionid
		}, {
			content: {
				$elemMatch: {
					sectionid: req.body.sectionid
				}
			}
		}, function(err, data) {
			if (err) {
				return res.send(err);
			}
			return res.send(data[0].content);
		});
	}


});

router.post('/getUser', function(req, res) {
	User.findOne({'_id': req.session.passport.user}, function(err, user) {
		if(err) {
			return res.send(err);
		}
		return res.send(user);
	});
});


module.exports = router;

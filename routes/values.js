var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Test = mongoose.model('test');
var Posts = mongoose.model('posts');


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
		Posts.update({
				postid: req.body.postid
			}, 
			{
				$push: { 
					connections: {
						sectionid: req.body.val.section_id,
						connectedto: req.body.val.connected_to
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
		
		console.log(req.body.val);
	} else {
		console.log('No data Received');
	}
	return res.status(200).send('Received Data');
});

module.exports = router;
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Test = mongoose.model('test');

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

module.exports = router;
var express = require('express');
var router = express.Router();

module.exports = function(passport) {

	router.get('/failure', function(req, res) {
		res.send({
			state: 'failure',
			user: null,
			message: 'Error'
		});
	});

	router.get('/success', function(req, res) {
		res.send({
			state: 'success',
			user: req.user,
			message: 'Successful'
		});
	});

	router.post('/signup', passport.authenticate('local-signup', {
		successRedirect: '/auth/success',
		failureRedirect: '/auth/failure'
	}));

	router.post('/login', passport.authenticate('local-login', {
		successRedirect: '/auth/success',
		failureRedirect: '/auth/failure'
	}));

	router.get('/facebook', passport.authenticate('facebook', {scope: ['email']}));
	router.get('/facebook/callback', passport.authenticate('facebook', {
		successRedirect: '/#/main',
		failureRedirect: '/'
	}));

	return router;
};
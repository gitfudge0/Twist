var mongoose = require('mongoose');
var User = mongoose.model('users');
var LocalStrategy = require('passport-local').Strategy;
var bCrypt = require('bcrypt-nodejs');
var FacebookStrategy = require('passport-facebook').Strategy;

module.exports = function(passport) {
	
	passport.serializeUser(function(user, done) {
		console.log('serializing user: ', user.userid);
		done(null, user._id);
	});
	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			done(err, user);	
		});
	});

	passport.use('local-signup', new LocalStrategy({
		passReqToCallback: true
	}, function(req, username, password, done) {
		User.findOne({'userid' : username}, function(err, user) {
			if(err) {
				console.log('Err in signup: ' + err);
				return done(err);
			}
			if(user) {
				console.log('User already exists with username: ' + username);
				return done(null, false, {message: 'User already exists'});
			} else {
				var newUser = new User();

				newUser.userid = username;
				newUser.password = createHash(password);

				newUser.save(function(err, user) {
					if(err) {
						console.log(err);
						return done(err);
					}
					console.log(newUser.userid + ' Signed up!');
					console.log(user);
					return done(null, user, {message: 'Signed up!'});
					req.session.currUser = newUser;
				});
			}
			
		});
	}));

	passport.use('local-login', new LocalStrategy({
		passReqToCallback: true,
	}, function(req, username, password, done) {
		User.findOne({'userid' : username}, function(err, user) {
			if(err) {
				return done(err);
			}
			if(!user) {
				return done(null, false, {message: 'User does not exist'});
			}
			if(!isValidPassword(user, password)) {
				return done(null, false, {message: 'Invalid Password'});
			}
			return done(null, user, {message: 'Login successful'});
		});
	}));

	passport.use(new FacebookStrategy({
		clientID: '1578193929152118',
		clientSecret: '5777225faa44b1057d246eda14d50043',
		callbackURL: 'http://localhost:3000/auth/facebook/callback',
		profileFields: ['id', 'displayName', 'emails'],
		passReqToCallback: true
	}, function(req, accessToken, refreshToken, profile, done){
		if(!req.user) {
			User.findOne({'facebook.id': profile.id}, function(err, user) {
				if(err) {
					return done(err);
				}
				if(user) {
					return done(null, user);
				} else {
					var newUser = new User();
					newUser.facebook.id = profile.id;
					newUser.facebook.token = accessToken;
					newUser.facebook.name = profile.displayName;
					newUser.facebook.email = profile.emails[0].value;

					newUser.save(function(err, data) {
						if(err)
							return done(err);
						return done(null, data);
					})
				}
			});	
		} else {
			var user = req.user;
			user.facebook.id = profile.id;
			user.facebook.token = accessToken;
			user.facebook.name = profile.displayName;
			user.facebook.email = profile.emails[0].value;			

			user.save(function(err, user) {
				if(err)
					throw err;
				return done(null, user);
			});
		}
		
	}));


	var isValidPassword = function(user, password){
		return bCrypt.compareSync(password, user.password);
	};
	// Generates hash using bCrypt
	var createHash = function(password){
		return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
	};

};
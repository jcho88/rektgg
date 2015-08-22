
/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var User = mongoose.model('User');
var utils = require('../../lib/utils');
var Recaptcha = require('recaptcha').Recaptcha;
var PUBLIC_KEY  = '6LcBQQsTAAAAAK4lD_65I8siuWYYC2X3yjwsQsIt',
    PRIVATE_KEY = '6LcBQQsTAAAAAMgwyOwPkH9NKPutEZLFdbA3xYjV';

/**
 * Load
 */

exports.load = function (req, res, next, id) {
  var options = {
    criteria: { _id : id }
  };
  User.load(options, function (err, user) {
    if (err) return next(err);
    if (!user) return next(new Error('Failed to load User ' + id));
    req.profile = user;
    next();
  });
};

/**
 * Create user
 */

exports.create = function (req, res) {
  var user = new User(req.body);
  user.provider = 'local';
  var data = {
      remoteip:  req.connection.remoteAddress,
      challenge: req.body.recaptcha_challenge_field,
      response:  req.body.recaptcha_response_field
  };
  var recaptcha = new Recaptcha(PUBLIC_KEY, PRIVATE_KEY, data);

  recaptcha.verify(function(success, error_code) {
    if (success) {
        res.send('Recaptcha response valid.');
        console.log("ERROR_CODE FOR RECAPTCHA: " + error_code)
    }
    else {
        // Redisplay the form.
        return res.render('users/signup', {
            layout: false,
            locals: {
              recaptcha_form: recaptcha.toHTML()
            }
        });
    }
  });

  user.save(function (err) {
    if (err) {
      return res.render('users/signup', {
        errors: utils.errors(err.errors),
        user: user,
        title: 'Sign up',
        recaptcha_form: recaptcha.toHTML()
      });
    }

    // manually login the user once successfully signed up
    req.logIn(user, function(err) {
      if (err) req.flash('info', 'Sorry! We are not able to log you in!');
      return res.redirect('/');
    });
  });
};


/**
 *  Show profile
 */

exports.show = function (req, res) {
  var user = req.profile;

  //set user rating
  user.rating = user.getRatings(); //write getRatings method to return average of the ratings

  res.render('users/show', {
    title: user.name,
    user: user
  });
};

exports.signin = function (req, res) {};

/**
 * Auth callback
 */

exports.authCallback = login;

/**
 * Show login form
 */

exports.login = function (req, res) {
  res.render('users/login', {
    title: 'Login'
  });
};

/**
 * Show sign up form
 */

exports.signup = function (req, res) {
  var recaptcha = new Recaptcha(PUBLIC_KEY, PRIVATE_KEY);
    
  res.render('users/signup', {
    title: 'Sign up',
    user: new User(),
    recaptcha_form: recaptcha.toHTML()
  });
};

/**
 * Logout
 */

exports.logout = function (req, res) {
  req.logout();
  res.redirect('/login');
};

/**
 * Session
 */

exports.session = login;

/**
 * Login
 */

function login (req, res) {
  var redirectTo = req.session.returnTo ? req.session.returnTo : '/';
  delete req.session.returnTo;
  res.redirect(redirectTo);
};

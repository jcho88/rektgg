
/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var User = mongoose.model('User');
var utils = require('../../lib/utils');
var Profile = mongoose.model('Profile')

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
  user.save(function (err) {
    if (err) {
      return res.render('users/signup', {
        errors: utils.errors(err.errors),
        user: user,
        title: 'Sign up'
      });
    }
    console.log("before I print user")
    console.log(user)

    var profile = new Profile({
      ownerID: user._id
    });

    profile.save(function(err, userinfo) {
    if(!err) {
        console.log("profile created");
    // manually login the user once successfully signed up
        req.logIn(user, function(err) {
          if (err) req.flash('info', 'Sorry! We are not able to log you in!');
          return res.redirect('/');
        });      
        
    
    }
    else {
      return res.render('users/signup', {
        errors: utils.errors(err.errors),
        user: user,
        title: 'Sign up'
      });        
        console.log("profile create error");
    }
    });//save     


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
  res.render('users/signup', {
    title: 'Sign up',
    user: new User()
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

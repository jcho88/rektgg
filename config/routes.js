
/*!
 * Module dependencies.
 */

// Note: We can require users, articles and other cotrollers because we have
// set the NODE_PATH to be ./app/controllers (package.json # scripts # start)
var mongoose = require('mongoose');
var home = require('home');
var users = require('users');
var articles = require('articles');
var comments = require('comments');

var tags = require('tags');
var auth = require('./middlewares/authorization');
var nodemailer = require('nodemailer');
var async = require('async');
var crypto = require('crypto');
var User = mongoose.model('User')

//for Rekt
var summoners = require('summoners');
var friends = require('friends');
var ratings = require('ratings');
var post = require('post');
//var testFriends = require('testFriends');

/**
 * Route middlewares
 */

var articleAuth = [auth.requiresLogin, auth.article.hasAuthorization];
var commentAuth = [auth.requiresLogin, auth.comment.hasAuthorization];
var ratingAuth  = [auth.requiresLogin, auth.rating.hasAuthorization];

/**
 * Expose routes
 */

module.exports = function (app, passport) {

  // user routes
  app.get('/login', users.login);
  app.get('/signup', users.signup);
  app.get('/logout', users.logout);
  app.post('/users', users.create);
  app.post('/users/session',
    passport.authenticate('local', {
      failureRedirect: '/login',
      failureFlash: 'Invalid email or password.'
    }), users.session);
  app.get('/users/:userId', users.show);
  app.get('/auth/facebook',
    passport.authenticate('facebook', {
      scope: [ 'email', 'user_about_me'],
      failureRedirect: '/login'
    }), users.signin);
  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
      failureRedirect: '/login'
    }), users.authCallback);
  app.get('/auth/github',
    passport.authenticate('github', {
      failureRedirect: '/login'
    }), users.signin);
  app.get('/auth/github/callback',
    passport.authenticate('github', {
      failureRedirect: '/login'
    }), users.authCallback);
  app.get('/auth/twitter',
    passport.authenticate('twitter', {
      failureRedirect: '/login'
    }), users.signin);
  app.get('/auth/twitter/callback',
    passport.authenticate('twitter', {
      failureRedirect: '/login'
    }), users.authCallback);
  app.get('/auth/google',
    passport.authenticate('google', {
      failureRedirect: '/login',
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email'
      ]
    }), users.signin);
  app.get('/auth/google/callback',
    passport.authenticate('google', {
      failureRedirect: '/login'
    }), users.authCallback);
  app.get('/auth/linkedin',
    passport.authenticate('linkedin', {
      failureRedirect: '/login',
      scope: [
        'r_emailaddress'
      ]
    }), users.signin);
  app.get('/auth/linkedin/callback',
    passport.authenticate('linkedin', {
      failureRedirect: '/login'
    }), users.authCallback);

  app.param('userId', users.load);

  // forgot password

  app.get('/forgot', function(req, res) {
    res.render('users/forgot', {
      user: req.user
    });
  });

  app.post('/forgot', function(req, res, next) {
    async.waterfall([
      function(done) {
        crypto.randomBytes(20, function(err, buf) {
          var token = buf.toString('hex');
          done(err, token);
        });
      },
      function(token, done) {
        User.findOne({ email: req.body.email }, function(err, user) {
          if (!user) {
            req.flash('error', 'No account with that email address exists.');
            return res.redirect('/forgot');
          }

          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

          user.save(function(err) {
            done(err, token, user);
          });
        });
      },
      function(token, user, done) {
        var smtpTransport = nodemailer.createTransport('SMTP', {
          service: 'gmail',
          auth: {
              user: 'RektGGTemp@gmail.com',
              pass: 'ronintyco'
          }
        });
        var mailOptions = {
          to: user.email,
          from: 'RektGGTemp@gmail.com',
          subject: 'RektGG Password Reset',
          text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            'http://' + req.headers.host + '/reset/' + token + '\n\n' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          req.flash('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
          done(err, 'done');
        });
      }
    ], function(err) {
      if (err) return next(err);
      res.redirect('/forgot');
    });
  });

  // reset password

  app.get('/reset/:token', function(req, res) {
    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
      if (!user) {
        req.flash('error', 'Password reset token is invalid or has expired.');
        return res.redirect('/forgot');
      }
      res.render('users/reset', {
        user: req.user
      });
    });
  });

  app.post('/reset/:token', function(req, res) {
    async.waterfall([
      function(done) {
        User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
          if (!user) {
            req.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect('back');
          }

          user.password = req.body.password;
          user.resetPasswordToken = undefined;
          user.resetPasswordExpires = undefined;

          user.save(function(err) {
            req.logIn(user, function(err) {
              done(err, user);
            });
          });
        });
      },
      function(user, done) {
        var smtpTransport = nodemailer.createTransport('SMTP', {
          service: 'gmail',
          auth: {
              user: 'RektGGTemp@gmail.com',
              pass: 'ronintyco'
          }
        });
        var mailOptions = {
          to: user.email,
          from: 'RektGGTemp@gmail.com',
          subject: 'Your password has been changed',
          text: 'Hello,\n\n' +
            'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          req.flash('success', 'Success! Your password has been changed.');
          done(err);
        });
      }
    ], function(err) {
      res.redirect('/');
    });
  });


  // article routes
  app.param('id', articles.load);
  app.get('/articles', articles.index); //load all articles
  app.get('/articles/new', auth.requiresLogin, articles.new); //takes you to form to create new article 
  app.post('/articles', auth.requiresLogin, articles.create); //create article
  app.get('/articles/:id', articles.show); //show a single article
  app.get('/articles/:id/edit', articleAuth, articles.edit); //takes you to form to edit article
  app.put('/articles/:id', articleAuth, articles.update); //updates the article
  app.delete('/articles/:id', articleAuth, articles.destroy); //delete article

  //summoner routes
  app.param('summonerId', summoners.load);
  app.get('/summonerSearch?:query', summoners.search); //show summoner
  app.get('/summoners/:reg/:summonerId', summoners.show); //show summoner
  app.post('/summoners/refresh', summoners.refresh); //show summoner

  //add friend routes
  app.post('/addfriend', friends.addFriend);//post
  app.post('/deletefriend', friends.deleteFriend);//delete
  app.get('/friends/:username', friends.isFriend);
  //app.get('/isFriend', friends.isFriend);

//test post
  app.get('/testactivity', function (req, res){

    console.log("test show");

    res.render('testactivity');
  }

);
  //user wall page
  app.get('/activity/:userid', post.index);
  app.post('/activity/post', auth.requiresLogin, post.createPost)
  app.post('/activity/deletePost', post.deletePost)
  //comment page
  app.get('/activity/:userid/:postId', post.getPost)
  app.post('/activity/comment', auth.requiresLogin, post.createPostComment); 
  app.post('/activity/deleteComment', post.deletePostComment);


  // app.get('/getallpost', post.getAllPost);
  // app.post('/testpost', post.createPost);
  // app.post('/testdelete', post.deletePost);  
  // app.post('/testcomment', post.createPostComment); 
  // app.post('/testdeletecomment', post.deletePostComment);
  // app.post('/testeditcomment', post.editPostComment) 
  // app.post('/testeditPost', post.editPost)       
//end test post

  // home route
  app.get('/', home.index);

  //app.get('/friendList', testFriends.index);

  // comment routes
  app.param('commentId', comments.load);
  app.post('/articles/:id/comments', auth.requiresLogin, comments.create);
  app.get('/articles/:id/comments', auth.requiresLogin, comments.create);
  app.delete('/articles/:id/comments/:commentId', commentAuth, comments.destroy);

  // tag routes
  app.get('/tags/:tag', tags.index);


  // rating routes
  app.param('ratingId', ratings.load);
  app.get('/summoner_ratings/:summonerId', ratings.index); //load all ratings
  app.post('/summoner_ratings/:summonerId', auth.requiresLogin, ratings.create); //create rating
  app.get('/ratings/:ratingId/edit', ratingAuth, ratings.edit); //takes you to form to edit rating
  app.put('/ratings/:ratingId', ratingAuth, ratings.update); //updates the rating
  app.delete('/ratings/:ratingId', ratingAuth, ratings.destroy); //delete rating

  // matches routes
  app.get('/matches/:matchId', summoners.show);


  /**
   * Error handling
   */

  app.use(function (err, req, res, next) {
    // treat as 404
    if (err.message
      && (~err.message.indexOf('not found')
      || (~err.message.indexOf('Cast to ObjectId failed')))) {
      return next();
    }
    console.error(err.stack);
    // error page
    res.status(500).render('500', { error: err.stack });
  });

  // assume 404 since no middleware responded
  app.use(function (req, res, next) {
    res.status(404).render('404', {
      url: req.originalUrl,
      error: 'Not found'
    });
  });
}

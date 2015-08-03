
/*!
 * Module dependencies.
 */

// Note: We can require users, articles and other cotrollers because we have
// set the NODE_PATH to be ./app/controllers (package.json # scripts # start)

var home = require('home');
var users = require('users');
var articles = require('articles');
var comments = require('comments');

var tags = require('tags');
var auth = require('./middlewares/authorization');

//for Rekt
var summoners = require('summoners');
var friends = require('friends');
var ratings = require('ratings');
var post = require('post');

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
  app.get('/summoners/:summonerId', summoners.show); //show summoner

  //add friend routes
  app.get('/addfriend', friends.addFriend);//post
  app.get('/deletefriend', friends.deleteFriend);//delete
  app.get('/getFriendList', friends.isFriend);
  //app.get('/isFriend', friends.isFriend);

//test post
  app.get('/testactivity', function (req, res){

    console.log("test show");

    res.render('testactivity');
  }

);

  app.post('/testpost', post.createPost);
  app.post('/testdelete', post.deletePost);  
  app.post('/testcomment', post.createPostComment); 
  app.post('/testdeletecomment', post.deletePostComment);
  app.post('/testeditcomment', post.editPostComment)     
//end test post

  // home route
  app.get('/', home.index);

  // comment routes
  app.param('commentId', comments.load);
  app.post('/articles/:id/comments', auth.requiresLogin, comments.create);
  app.get('/articles/:id/comments', auth.requiresLogin, comments.create);
  app.delete('/articles/:id/comments/:commentId', commentAuth, comments.destroy);

  // tag routes
  app.get('/tags/:tag', tags.index);


  // rating routes
  app.param('ratingId', ratings.load);
  app.get('/ratings', ratings.index); //load all ratings
  app.get('/ratings/new', auth.requiresLogin, ratings.new); //takes you to form to create new rating 
  app.post('/ratings', auth.requiresLogin, ratings.create); //create rating
  app.get('/ratings/:ratingId', ratings.show); //show a single ratings
  app.get('/ratings/:ratingId/edit', ratingAuth, ratings.edit); //takes you to form to edit rating
  app.put('/ratings/:ratingId', ratingAuth, ratings.update); //updates the rating
  app.delete('/ratings/:ratingId', ratingAuth, ratings.destroy); //delete rating 

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

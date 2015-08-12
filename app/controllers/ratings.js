
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
var Rating = mongoose.model('Rating')
var utils = require('../../lib/utils')
var extend = require('util')._extend

/**
 * Load
 */

exports.load = function (req, res, next, id){
  Rating.load(id, function (err, rating) {
    if (err) return next(err);                          //error handle
    if (!rating) return next(new Error('not found'));   //no rating exists
    req.rating = rating;                                //set requested rating to be rating
    next();                                             //next function
  });
};


/**
 * Create a rating
 */

exports.create = function (req, res){
  console.log("rating create");
  var rating = new Rating(req.body);                                //new rating with req.body info (rating model filled)

  rating.user = req.user;                                           //set user of the rating model to be the current user

  rating.save(function(err) {                                       //save the rating
	    if (!err) {
	  	  req.flash('success', 'Successfully created a rating!');     //no error, create the rating and redirect
	  	  return res.redirect('/summoner_ratings/'+rating.summoner);
	    }
	    console.log(err);                                             //print error, flash appropriate error message
      if(err.message == 'Validation failed'){
        req.flash('error', err.errors.value.message);
      }
      else {
        req.flash('error', err.message);
      }
    	res.redirect('back');                                         //redirect to previous page
	});
};


/**
 * New rating form & list ratings
 */

exports.index = function (req, res){
  var page = (req.param('page') > 0 ? req.param('page') : 1) - 1;   //if param('page') > 0, then param('page') or 1
  var perPage = 10;                                                 //set max reviews per page to be 10

  var options = {                                                   //set options to be called into list function
    perPage: perPage,
    page: page,
    criteria : {summoner: req.summoner._id}
  };


  Rating.list(options, function (err, ratings) {                    //call list function in model
    if (err) return res.render('500');
    Rating.count().exec(function (err, count) {                     //Returns the count of documents that would match a find() query. 
      res.render('ratings/ratings', {                               //The db.collection.count() method does not perform the find() operation
        title: 'Ratings',                                           //but instead counts and returns the number of results that match a query.
        rating: new Rating(),
        summoner: req.summoner,                                     //pass in the summoner information
        ratings: ratings,
        page: page + 1,
        pages: Math.ceil(count / perPage)
      });
    });
  });
};


/**
 * Edit a rating
 */

exports.edit = function (req, res) {
  res.render('ratings/ratings', {                                  //render an individual rating page that sets the rating to be the rating
    title: 'Edit ' + req.rating.title,                             //the user clicked for that summoner so that they may edit it
    rating: req.rating,
    summoner: req.rating.summoner
  });
}


/**
 * Update rating
 */

exports.update = function (req, res){
  var rating = req.rating;                                          //set rating to be the rating the user updates

  // make sure no one changes the user
  delete req.body.user;
  rating = extend(rating, req.body);

  rating.save(function(err) {
	  	if (!err) {
        req.flash('info', 'Review Updated');
	  		return res.redirect('/summoner_ratings/'+rating.summoner);
	  	}

		res.render('ratings/ratings', {
		  	title: 'Edit Rating',
		  	rating: rating,
		  	errors: utils.errors(err.errors || err)
		});
	});
}


/**
 * Delete a rating
 */

exports.destroy = function (req, res){
  var rating = req.rating;
  rating.remove(function (err){
    req.flash('info', 'Deleted successfully');
    res.redirect('back');
  });
}


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

  console.log("rating.load");
  var User = mongoose.model('User');

  Rating.load(id, function (err, rating) {
    if (err) return next(err);
    if (!rating) return next(new Error('not found'));
    req.rating = rating;
    next();
  });
};

/**
 * New rating
 */

exports.new = function (req, res){
  res.render('ratings/new', {
    title: 'New Rating',
    rating: new Rating({})
  });
};

/**
 * Create a rating
 */

exports.create = function (req, res){
  console.log("below is body");
  console.log(req.body);
  var rating = new Rating(req.body);

  rating.userId = req.user;

  rating.save(function(err) {
	    if (!err) {
	  	  req.flash('success', 'Successfully created a rating!');
	  	  return res.redirect('/ratings/'+rating._id);
	    }
	    console.log(err);
		res.render('ratings/new', {
			title: 'New Rating',
		    rating: rating,
		    errors: utils.errors(err.errors || err)
		 });
	});
};

/**
 * New rating form & list ratings
 */

exports.index = function (req, res){
  console.log("rating controller");
  var page = (req.param('page') > 0 ? req.param('page') : 1) - 1;
  var perPage = 30;
  var options = {
    perPage: perPage,
    page: page
  };

  Rating.list(options, function (err, ratings) {
    if (err) return res.render('500');
    Rating.count().exec(function (err, count) {
      res.render('ratings/ratings', {
        title: 'Ratings',
        rating: new Rating({}),
        ratings: ratings,
        page: page + 1,
        pages: Math.ceil(count / perPage)
      });
    });
  });
};

/**
 * Show
 */

exports.show = function (req, res){
  res.render('ratings/show', {
    title: req.rating.title,
    rating: req.rating
  });
};


/**
 * Edit a rating
 */

exports.edit = function (req, res) {
  res.render('ratings/edit', {
    title: 'Edit ' + req.rating.title,
    rating: req.rating
  });
}

/**
 * Update rating
 */

exports.update = function (req, res){
  var rating = req.rating;

  // make sure no one changes the user
  delete req.body.user;
  rating = extend(rating, req.body);

  rating.save(function(err) {
	  	if (!err) {
	  		return res.redirect('/ratings/' + rating._id);
	  	}

		res.render('ratings/edit', {
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
    res.redirect('/ratings');
  });
}

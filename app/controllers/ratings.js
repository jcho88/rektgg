
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
  var User = mongoose.model('User');

  Rating.load(id, function (err, rating) {
    if (err) return next(err);
    if (!rating) return next(new Error('not found'));
    req.rating = rating;

    console.log(rating)
    next();
  });
};

/**
 * New rating
 */

// exports.new = function (req, res){
//   res.render('ratings/new', {
//     title: 'New Rating',
//     rating: new Rating({})
//   });
// };

/**
 * Create a rating
 */

exports.create = function (req, res){
  console.log("rating create");
  var rating = new Rating(req.body);

  console.log(rating)

  rating.userId = req.user;

  rating.save(function(err) {
    console.log(err)

	    if (!err) {
	  	  req.flash('success', 'Successfully created a rating!');
	  	  return res.redirect('/summoner_ratings/'+rating.summoner);
	    }
	    console.log(err);
		res.render('ratings/'+rating.id, {
			title: 'New Rating',
		    rating: rating,
        summoner: rating.summoner,
		    errors: utils.errors(err.errors || err)
		 });
	});
};

/**
 * New rating form & list ratings
 */

exports.index = function (req, res){
  var page = (req.param('page') > 0 ? req.param('page') : 1) - 1;
  var perPage = 30;
  // var options = {
  //   perPage: perPage,
  //   page: page
  // };

  var options = {
    criteria : {summoner: req.summoner._id}
  };


  Rating.list(options, function (err, ratings) {
    if (err) return res.render('500');
    Rating.count().exec(function (err, count) {
      res.render('ratings/ratings', {
        title: 'Ratings',
        rating: new Rating(),
        summoner: req.summoner,
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
  console.log("controller edit");
  res.render('ratings/ratings', {
    title: 'Edit ' + req.rating.title,
    rating: req.rating,
    summoner: req.rating.summoner
  });
}

/**
 * Update rating
 */

exports.update = function (req, res){
  console.log("controller update");
  var rating = req.rating;

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

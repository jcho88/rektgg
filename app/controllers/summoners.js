/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
var Summoner = mongoose.model('Summoner')
var utils = require('../../lib/utils')
var extend = require('util')._extend

/**
 * Load
 */

exports.load = function (req, res, next, id){
console.log("test load");
  Summoner.load(id, function (err, summoner) {
  	console.log("summoner" + summoner);
    if (err) return next(err);
    if (!summoner) return next(new Error('not found'));
    req.summoner = summoner;
    next();
  });
};


exports.show = function (req, res){
	console.log("test show");
  res.render('summoners/show', {
    summoner: req.summoner
  });
};


/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
var utils = require('../../lib/utils')
var extend = require('util')._extend

exports.index = function (req, res){
  res.render('friends/friends');
};
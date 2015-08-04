
/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var config = require('config');
var utils = require('../../lib/utils');

var Schema = mongoose.Schema;

/**
 * Rating Schema
 */

var RatingSchema = new Schema({

	title: {type : String, default : '', trim : true},			//title the review (headline)
  body: {type : String, default : '', trim : true},			//the review
  value: {type: Number, required: true},						//value of rating
	summoner: {type : Schema.ObjectId, ref : 'Summoner'},		//summoner being reviewed
	user: {type : Schema.ObjectId, ref : 'User'},				//user reviewing summoner
	comments: [{												//comments for the review
    	body: { type : String, default : '' },
    	user: { type : Schema.ObjectId, ref : 'User' },
    	createdAt: { type : Date, default : Date.now }
  	}],
	createdAt: {type : Date, default : Date.now}

});

/**
 * Validations
 */

RatingSchema.path('user').required(true, 'You must be logged in to rate a user');
RatingSchema.path('value').required(true, 'Rate the user from 1 to 5 stars');

RatingSchema.statics = {

  /**
   * Find rating by id
   *
   * @param {ObjectId} id
   * @param {Function} cb
   * @api private
   */

  load: function (id, cb) {
    this.findOne({ _id : id })
      .populate('summoner')   // in future change to just summoner info (name, profile pic, e.g...)
      .populate('user')
      .exec(cb);
  },

  /**
   * List ratings
   *
   * @param {Object} options
   * @param {Function} cb
   * @api private
   */

  list: function (options, cb) {
    var criteria = options.criteria || {}

    this.find(criteria)
      .populate('user', 'name username')
      .sort({'createdAt': -1}) // sort by date
      .limit(options.perPage)
      .skip(options.perPage * options.page)
      .exec(cb);
  }
}

mongoose.model('Rating', RatingSchema);
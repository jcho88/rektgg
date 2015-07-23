var mongoose = require('mongoose');
var config = require('config');
var utils = require('../../lib/utils');

var Schema = mongoose.Schema;

/**
 * Rating Schema
 */

var RatingSchema = new Schema({

	ownerId: {type : String, default : '', trim : true},
	userId: {type : Schema.ObjectId, ref : 'User'},
	summonerId: {type : Schema.ObjectId, ref : 'Summoner'},
	stars: {type: Number, required: true},
	comments: {type : String, default : '', trim : true},
	createdAt: {type : Date, default : Date.now}

});

mongoose.model('Rating', RatingSchema);
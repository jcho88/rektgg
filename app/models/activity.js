var mongoose = require('mongoose');
var config = require('config');
var utils = require('../../lib/utils');

var Schema = mongoose.Schema;

var ActivitySchema = new Schema({
	ownerID: {type : String, default : '', trim : true},
	message: {type : String, default : '', trim : true},
	created_at: {type : String, default : '', trim : true},
	thumbs_up: {type : int, default : 0, trim : true},
	thumbs_down: {type : int, default : 0, trim : true}

});

mongoose.model('Activity', ActivitySchema);
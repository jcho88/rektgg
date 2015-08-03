var mongoose = require('mongoose');
var config = require('config');
var utils = require('../../lib/utils');

var Schema = mongoose.Schema;

var PostCommentSchema = new Schema({
	ownerId: {type : String, default : '', trim : true},
	message: {type : String, default : '', trim : true},
	create_at: {type : String, default : '', trim : true},
	postId: {type : String, default : '', trim : true}

});

mongoose.model('PostComment', PostCommentSchema);
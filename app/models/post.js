var mongoose = require('mongoose');
var config = require('config');
var utils = require('../../lib/utils');

var Schema = mongoose.Schema;

var PostSchema = new Schema({
	ownerId: {type : String, default : '', trim : true, ref: 'User'},
	message: {type : String, default : '', trim : true},
	created_at: {type : String, default : '', trim : true},
	thumbs_up: {type : Number, default : 0, trim : true},
	thumbs_down: {type : Number, default : 0, trim : true},
	commmetsList:{
		messasge: {type : String, default : '', trim : true},
		authorId: {type : String, default : '', trim : true, ref: 'User'},
		created_at: {type : String, default : '', trim : true},
		thumbs_up: {type : Number, default : 0, trim : true},
		thumbs_down: {type : Number, default : 0, trim : true}
	},
	userWallId: {type : String, default : '', trim : true, ref: 'User'}

});

PostSchema.statics = {
       

}



mongoose.model('Post', PostSchema);
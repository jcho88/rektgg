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
	commetsList:[{
		message: {type : String,default : '', trim : true},
		authorId: {type : String, default : '', trim : true, ref: 'User'},
		created_at: {type : String, default : '', trim : true},
		thumbs_up: {type : Number, default : 0, trim : true},
		thumbs_down: {type : Number, default : 0, trim : true}
	}],
	userWallId: {type : String, default : '', trim : true, ref: 'User'}

});

PostSchema.statics = {
      
  deletePost: function (ownerId,postId, cb) {
    this.find({
    	$and: [
    	{ownerId : ownerId },  
        {_id: postId}
        ]})

      .remove().exec(cb);
  }, 

  createPostComment: function (commentData, postId, cb) {

    this.update({ _id: postId },
    			{$push: {'commetsList': {
    				message: commentData.message, 
    				authorId: commentData.authorId,
    				created_at: commentData.created_at
    			}}},
    			{safe: true, upsert: true})

      .exec(cb);
  },
  deletePostComment: function (commentId, postId, cb) {
    console.log(commentId)
    console.log(postId)
    this.update({ _id: postId },
          { $pull: { 'commetsList': { _id: commentId } } },
          {safe: true, upsert: true})

      .exec(cb);
  },

  editPostComment: function (message, commentId, cb) {
    console.log(message)
    console.log(commentId)
    this.update({'commetsList._id': commentId},
           {'$set' :{ 'commetsList.$.message': message}})

      .exec(cb);
  },    
}



mongoose.model('Post', PostSchema);
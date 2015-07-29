var mongoose = require('mongoose')
var Post = mongoose.model('Post')
var utils = require('../../lib/utils')
var extend = require('util')._extend
var request = require('request')
var async = require('async')

exports.createPost = function (req, res){

	if(req.user){
		var userID = req.user._id;
		console.log(req.body.mypost)

		var date = new Date();
		var newPost = new Post({

			message: req.body.mypost,
			createdAt: date,
			ownerId: userID,
			privacy: "P"
		});//newPost

		newPost.save(function(err, postinfo) {
		if(!err) {
		    console.log("post created");
  
		}
		else {
		    console.log("error creating post");
		}
		});//save	


	}//if
	else{
		//route to somewhere
		console.log("user not login (coner case)")
	}//else


}

exports.deletePost = function (req, res){

}

exports.getAllPost = function (req, res){

}

exports.editPost = function (req, res){

}